import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { OrdersService } from './orders.service';
import { plainToInstance } from 'class-transformer';
import { OrderResponseDto } from './dto/order-response.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Req() res: Request) {
    const currentUser = res.user;
    const orders = await this.ordersService.findAll(currentUser);
    return plainToInstance(OrderResponseDto, orders, {
      excludeExtraneousValues: true,
    });
  }
}
