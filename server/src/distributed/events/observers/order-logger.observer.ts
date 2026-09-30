import { Injectable } from '@nestjs/common';

import { OrderStatusChangedEvent } from '../order-status-changed.event';
import { OrderCreatedEvent } from '../order-created.event';

@Injectable()
export class OrderLoggerObserver {
  update(event: OrderStatusChangedEvent | OrderCreatedEvent) {
    if ('previousStatus' in event) {
      console.log(
        `[Observer][Logger] Order ${event.orderId}: ` +
          `${event.previousStatus} -> ${event.newStatus}`,
      );

      return;
    }

    console.log(
      `[Observer][Logger] Order ${event.orderId} created with status ${event.status}`,
    );
  }
}
