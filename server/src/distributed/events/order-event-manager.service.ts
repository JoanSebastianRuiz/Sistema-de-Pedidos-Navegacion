import { Injectable } from '@nestjs/common';

import { OrderStatusChangedEvent } from './order-status-changed.event';
import { OrderLoggerObserver } from './observers/order-logger.observer';
import { OrderNotificationObserver } from './observers/order-notification.observer';
import { MetricsObserver } from './observers/metrics.observer';
import { OrderCreatedEvent } from './order-created.event';

interface OrderObserver {
  update(event: OrderStatusChangedEvent | OrderCreatedEvent): void;
}

@Injectable()
export class OrderEventManagerService {
  private readonly observers: OrderObserver[] = [];

  constructor(
    private readonly orderLoggerObserver: OrderLoggerObserver,
    private readonly orderNotificationObserver: OrderNotificationObserver,
    private readonly metricsObserver: MetricsObserver,
  ) {
    this.subscribe(orderLoggerObserver);
    this.subscribe(orderNotificationObserver);
    this.subscribe(metricsObserver);
  }

  subscribe(observer: OrderObserver) {
    this.observers.push(observer);
  }

  unsubscribe(observer: OrderObserver) {
    const index = this.observers.indexOf(observer);

    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(event: OrderStatusChangedEvent | OrderCreatedEvent) {
    this.observers.forEach((observer) => {
      observer.update(event);
    });
  }
}
