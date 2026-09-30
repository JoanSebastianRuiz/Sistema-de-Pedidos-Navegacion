import { ConflictException, Injectable } from '@nestjs/common';
import { CurrentUserDto } from 'src/shared/domain/current-user.dto';
import { OrdersRepository } from './orders.repository';
import { ORDER_ERROR_CODES } from 'src/shared/errors';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderProcessingResult } from 'src/distributed/workers/types/order-processing-result.type';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async create(
    currentUser: CurrentUserDto,
    ordenProcessingResult: OrderProcessingResult,
  ) {
    return await this.ordersRepository.create(
      currentUser,
      ordenProcessingResult,
    );
  }

  async findAll(currentUser: CurrentUserDto) {
    if (!currentUser) {
      throw new ConflictException({
        message: ORDER_ERROR_CODES.USER_NOT_FOUND,
      });
    }
    return await this.ordersRepository.findAll(currentUser);
  }

  async updateStatus(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: CurrentUserDto,
  ) {
    if (!currentUser) {
      throw new ConflictException({
        message: ORDER_ERROR_CODES.USER_NOT_FOUND,
      });
    }

    return await this.ordersRepository.updateStatus(
      id,
      updateOrderStatusDto.status,
      currentUser,
    );
  }
}
