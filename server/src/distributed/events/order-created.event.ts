import { OrderStatus } from 'src/shared/domain/order-status.enum';

export interface OrderCreatedEvent {
  orderId: number;
  status: OrderStatus;
  userId: number;
  timestamp: Date;
}
