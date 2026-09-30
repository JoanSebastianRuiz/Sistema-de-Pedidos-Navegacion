import { Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { OrderStatusChangedEvent } from './order-status-changed.event';
import { OrderCreatedEvent } from './order-created.event';

@Injectable()
export class DistributedEventService {
  private readonly gatewayUrl = 'http://localhost:3005';

  constructor(private readonly httpService: HttpService) {}

  async publishOrderStatusChanged(event: OrderStatusChangedEvent) {
    await firstValueFrom(
      this.httpService.post(
        `${this.gatewayUrl}/api/events/order-status-changed`,
        event,
        {
          headers: {
            'x-internal-key': process.env.INTERNAL_WORKER_KEY,
          },
        },
      ),
    );
  }

  async publishOrderCreated(event: OrderCreatedEvent) {
    await firstValueFrom(
      this.httpService.post(
        `${this.gatewayUrl}/api/events/order-created`,
        event,
        {
          headers: {
            'x-internal-key': process.env.INTERNAL_WORKER_KEY,
          },
        },
      ),
    );
  }
}
