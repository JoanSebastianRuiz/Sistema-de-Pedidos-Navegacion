import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { UpdateOrderStatusDto } from 'src/orders/dto/update-order-status.dto';
import { OrdersService } from 'src/orders/orders.service';
import { CurrentUserDto } from 'src/shared/domain/current-user.dto';
import { ThreadPoolService } from './thread-pool/thread-pool.service';
import { ProductsRepository } from 'src/products/products.repository';
import { ORDER_ERROR_CODES } from 'src/shared/errors';
import { OrderProcessingResult } from './types/order-processing-result.type';
import { OrdersRepository } from 'src/orders/orders.repository';
import { OrderStatus } from 'src/shared/domain/order-status.enum';
import { DistributedEventService } from '../events/distributed-event.service';

@Injectable()
export class WorkersService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly ordersRepository: OrdersRepository,
    private readonly threadPoolService: ThreadPoolService,
    private readonly productsRepository: ProductsRepository,
    private readonly distributedEventService: DistributedEventService,
  ) {}

  async processOrder(
    createOrderDto: CreateOrderDto,
    currentUser: CurrentUserDto,
  ) {
    const startTime = performance.now();

    if (!currentUser) {
      throw new ConflictException({
        message: ORDER_ERROR_CODES.USER_NOT_FOUND,
      });
    }

    if (createOrderDto.orderDetails.length === 0) {
      throw new ConflictException({
        message: ORDER_ERROR_CODES.ORDER_DETAILS_INVALID,
      });
    }

    const productIds = createOrderDto.orderDetails.map(
      (detail) => detail.productId,
    );

    const existingProducts = await this.productsRepository.findByIds(
      ...productIds,
    );

    if (!existingProducts || existingProducts.length !== productIds.length) {
      throw new ConflictException({
        message: ORDER_ERROR_CODES.SOME_PRODUCTS_NOT_FOUND,
      });
    }

    const taskId = `order-${Date.now()}-${Math.random()}`;

    console.log(`[Worker] Sending order ${taskId} to thread pool`);

    const orderProcessingResult =
      await this.threadPoolService.execute<OrderProcessingResult>({
        taskId,
        type: 'process-order',
        order: createOrderDto,
        products: existingProducts,
      });

    console.log(`[Worker] Thread completed order ${taskId}`);

    const order = await this.ordersService.create(
      currentUser,
      orderProcessingResult,
    );

    await this.distributedEventService.publishOrderCreated({
      orderId: order.id,
      status: order.status as OrderStatus,
      userId: currentUser.id,
      timestamp: new Date(),
    });

    const elapsedTime = performance.now() - startTime;

    console.log(
      `[Worker] Order ${order.id} processed in ${elapsedTime.toFixed(2)} ms`,
    );

    return order;
  }

  async updateOrderStatus(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: CurrentUserDto,
  ) {
    const taskId = `status-${id}-${Date.now()}-${Math.random()}`;

    console.log(`[Worker] Sending status update ${taskId} to thread pool`);

    const order = await this.ordersRepository.findById(id, currentUser);

    if (!order) {
      throw new ConflictException({
        message: ORDER_ERROR_CODES.ORDER_NOT_FOUND,
      });
    }

    const { data: { isValid } = {} } = await this.threadPoolService.execute<{
      data: { isValid: boolean };
    }>({
      taskId,
      type: 'validate-order-status',
      status: updateOrderStatusDto.status,
      currentStatus: order.status,
    });

    if (!isValid) {
      throw new ConflictException({
        message: ORDER_ERROR_CODES.INVALID_ORDER_STATUS,
      });
    }

    const updatedOrder = await this.ordersService.updateStatus(
      id,
      updateOrderStatusDto,
      currentUser,
    );

    await this.distributedEventService.publishOrderStatusChanged({
      orderId: id,
      previousStatus: order.status as OrderStatus,
      newStatus: updateOrderStatusDto.status,
      userId: currentUser.id,
      timestamp: new Date(),
    });

    return updatedOrder;
  }
}
