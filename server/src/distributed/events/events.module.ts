import { Module } from '@nestjs/common';

import { EventsController } from './events.controller';
import { OrderEventManagerService } from './order-event-manager.service';

import { OrderLoggerObserver } from './observers/order-logger.observer';
import { OrderNotificationObserver } from './observers/order-notification.observer';
import { MetricsObserver } from './observers/metrics.observer';

@Module({
  controllers: [EventsController],
  providers: [
    OrderEventManagerService,
    OrderLoggerObserver,
    OrderNotificationObserver,
    MetricsObserver,
  ],
  exports: [OrderEventManagerService],
})
export class EventsModule {}
