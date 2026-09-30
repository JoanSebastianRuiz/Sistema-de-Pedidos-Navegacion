import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { Public } from 'src/auth/decorators/public.decorator';

import { OrderEventManagerService } from './order-event-manager.service';
import { InternalKeyGuard } from '../workers/guards/internal-key.guard';
import type { OrderStatusChangedEvent } from './order-status-changed.event';
import { MetricsObserver } from './observers/metrics.observer';
import type { OrderCreatedEvent } from './order-created.event';

@Controller('events')
export class EventsController {
  constructor(
    private readonly orderEventManager: OrderEventManagerService,
    private readonly metricsObserver: MetricsObserver,
  ) {}

  @Post('order-status-changed')
  @Public()
  @UseGuards(InternalKeyGuard)
  handleOrderStatusChanged(@Body() event: OrderStatusChangedEvent) {
    this.orderEventManager.notify(event);

    return {
      success: true,
    };
  }

  @Post('order-created')
  @Public()
  @UseGuards(InternalKeyGuard)
  handleOrderCreated(@Body() event: OrderCreatedEvent) {
    this.orderEventManager.notify(event);

    return {
      success: true,
    };
  }

  @Get('metrics')
  @Public()
  getMetrics() {
    return this.metricsObserver.getMetrics();
  }
}
