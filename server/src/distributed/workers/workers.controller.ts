import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { CurrentUserDto } from 'src/shared/domain/current-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { InternalKeyGuard } from './guards/internal-key.guard';
import { UpdateOrderStatusDto } from 'src/orders/dto/update-order-status.dto';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post('orders')
  @Public()
  @UseGuards(InternalKeyGuard)
  processOrder(
    @Body()
    body: {
      createOrderDto: CreateOrderDto;
      currentUser: CurrentUserDto;
    },
  ) {
    return this.workersService.processOrder(
      body.createOrderDto,
      body.currentUser,
    );
  }

  @Patch('orders/:id/status')
  @Public()
  @UseGuards(InternalKeyGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      updateOrderStatusDto: UpdateOrderStatusDto;
      currentUser: CurrentUserDto;
    },
  ) {
    return this.workersService.updateOrderStatus(
      id,
      body.updateOrderStatusDto,
      body.currentUser,
    );
  }
}
