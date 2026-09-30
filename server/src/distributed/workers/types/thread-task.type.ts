import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { ProductResponseDto } from 'src/products/dto/product-response.dto';
import { OrderStatus } from 'src/shared/domain/order-status.enum';

export type ThreadTask =
  | {
      taskId: string;
      type: 'process-order';
      order: CreateOrderDto;
      products: ProductResponseDto[];
    }
  | {
      taskId: string;
      type: 'validate-order-status';
      status: OrderStatus;
      currentStatus: string;
    };
