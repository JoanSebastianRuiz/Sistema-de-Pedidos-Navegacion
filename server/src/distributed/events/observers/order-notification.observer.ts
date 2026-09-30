import { Injectable } from '@nestjs/common';
import { OrderStatusChangedEvent } from '../order-status-changed.event';
import { OrderCreatedEvent } from '../order-created.event';

@Injectable()
export class OrderNotificationObserver {
  update(event: OrderStatusChangedEvent | OrderCreatedEvent) {
    if ('newStatus' in event) {
      console.log(
        `[Observer][Notification] Order ${event.orderId} changed to ${event.newStatus}`,
      );

      return;
    }

    console.log(
      `[Observer][Notification] Order ${event.orderId} created with status ${event.status}`,
    );
  }
}
