import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/orders.module';
import { ProductsModule } from 'src/products/products.module';
import { EventsModule } from '../events/events.module';
import { WorkersController } from './workers.controller';
import { WorkersService } from './workers.service';
import { ThreadPoolService } from './thread-pool/thread-pool.service';
import { DistributedEventService } from '../events/distributed-event.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [OrdersModule, ProductsModule, EventsModule, HttpModule],
  controllers: [WorkersController],
  providers: [WorkersService, ThreadPoolService, DistributedEventService],
})
export class WorkersModule {}
