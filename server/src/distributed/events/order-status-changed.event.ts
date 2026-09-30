import { OrderStatus } from 'src/shared/domain/order-status.enum';

export interface OrderStatusChangedEvent {
  orderId: number;
  previousStatus: OrderStatus;
  newStatus: OrderStatus;
  userId: number;
  timestamp: Date;
}
