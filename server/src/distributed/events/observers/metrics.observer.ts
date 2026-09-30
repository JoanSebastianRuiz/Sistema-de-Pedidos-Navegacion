import { Injectable } from '@nestjs/common';

import { OrderStatusChangedEvent } from '../order-status-changed.event';
import { OrderCreatedEvent } from '../order-created.event';

@Injectable()
export class MetricsObserver {
  private totalEvents = 0;
  private eventsByStatus = new Map<string, number>();
  private totalProcessingTime = 0;
  private lastEventAt?: Date;

  update(event: OrderStatusChangedEvent | OrderCreatedEvent) {
    const timestamp = new Date(event.timestamp);

    this.totalEvents++;

    const status = 'newStatus' in event ? event.newStatus : event.status;

    const statusCount = this.eventsByStatus.get(status) ?? 0;

    this.eventsByStatus.set(status, statusCount + 1);

    if (this.lastEventAt) {
      const processingTime = timestamp.getTime() - this.lastEventAt.getTime();

      this.totalProcessingTime += processingTime;
    }

    this.lastEventAt = timestamp;

    if ('previousStatus' in event) {
      console.log(
        `[Observer][Metrics] ` +
          `Event #${this.totalEvents} | ` +
          `Order ${event.orderId} | ` +
          `${event.previousStatus} -> ${event.newStatus}`,
      );

      return;
    }

    console.log(
      `[Observer][Metrics] ` +
        `Event #${this.totalEvents} | ` +
        `Order ${event.orderId} | ` +
        `Created with status ${event.status}`,
    );
  }

  getMetrics() {
    const averageProcessingTime =
      this.totalEvents > 1
        ? this.totalProcessingTime / (this.totalEvents - 1)
        : 0;

    return {
      totalEvents: this.totalEvents,
      eventsByStatus: Object.fromEntries(this.eventsByStatus),
      averageIntervalMs: averageProcessingTime,
      lastEventAt: this.lastEventAt ?? null,
    };
  }
}
