import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { CurrentUserDto } from 'src/shared/domain/current-user.dto';
import { UpdateOrderStatusDto } from 'src/orders/dto/update-order-status.dto';

@Injectable()
export class GatewayService {
  private readonly workers =
    process.env.WORKERS?.split(',').map((port) => `http://localhost:${port}`) ||
    [];
  private currentWorker = 0;

  constructor(private readonly httpService: HttpService) {}

  private getNextWorker(): string {
    const worker = this.workers[this.currentWorker];
    this.currentWorker = (this.currentWorker + 1) % this.workers.length;
    return worker;
  }

  private async sendToWorker<T>(
    request: (worker: string) => Promise<T>,
  ): Promise<T> {
    const firstWorker = this.getNextWorker();
    try {
      console.log(`[Gateway] Trying worker ${firstWorker}`);
      return await request(firstWorker);
    } catch (error) {
      console.error(`[Gateway] Worker ${firstWorker} failed`, error);
    }

    const availableWorkers = this.workers.filter(
      (worker) => worker !== firstWorker,
    );

    for (const worker of availableWorkers) {
      try {
        console.log(`[Gateway] Failover - trying worker ${worker}`);
        return await request(worker);
      } catch (error) {
        console.error(`[Gateway] Worker ${worker} failed`, error);
      }
    }

    throw new ServiceUnavailableException('No workers are available');
  }

  async processOrder(
    createOrderDto: CreateOrderDto,
    currentUser: CurrentUserDto,
  ) {
    return await this.sendToWorker(async (worker) => {
      const response = await firstValueFrom(
        this.httpService.post(
          `${worker}/api/workers/orders`,
          { createOrderDto, currentUser },
          { headers: { 'x-internal-key': process.env.INTERNAL_WORKER_KEY } },
        ),
      );
      return response.data;
    });
  }

  async updateOrderStatus(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: CurrentUserDto,
  ) {
    return await this.sendToWorker(async (worker) => {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${worker}/api/workers/orders/${id}/status`,
          { updateOrderStatusDto, currentUser },
          { headers: { 'x-internal-key': process.env.INTERNAL_WORKER_KEY } },
        ),
      );
      return response.data;
    });
  }
}
