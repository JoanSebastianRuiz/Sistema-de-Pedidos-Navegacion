import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';

import { GatewayService } from './gateway.service';
import type { Request } from 'express';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { plainToInstance } from 'class-transformer';
import { OrderResponseDto } from 'src/orders/dto/order-response.dto';
import { UpdateOrderStatusDto } from 'src/orders/dto/update-order-status.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('distributed')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post('orders')
  @SkipThrottle()
  async processOrder(
    @Req() req: Request,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const startTime = performance.now();

    const currentUser = req.user;

    const order = await this.gatewayService.processOrder(
      createOrderDto,
      currentUser,
    );

    const elapsedTime = performance.now() - startTime;

    console.log(
      `[Gateway] Order ${order.id} completed in ${elapsedTime.toFixed(2)} ms`,
    );

    return plainToInstance(OrderResponseDto, order, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('orders/:id/status')
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const currentUser = req.user;

    const order = await this.gatewayService.updateOrderStatus(
      id,
      updateOrderStatusDto,
      currentUser,
    );

    return plainToInstance(OrderResponseDto, order, {
      excludeExtraneousValues: true,
    });
  }
}
