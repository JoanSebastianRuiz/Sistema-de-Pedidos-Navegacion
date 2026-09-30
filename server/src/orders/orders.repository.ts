import { ConflictException, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/drizzle/client';
import { orderDetails, orders } from 'src/database/drizzle/schema';
import { CurrentUserDto } from 'src/shared/domain/current-user.dto';
import { OrderStatus } from 'src/shared/domain/order-status.enum';
import { Role } from 'src/shared/domain/role.enum';
import { ORDER_ERROR_CODES } from 'src/shared/errors';
import _ from 'lodash';
import { OrderProcessingResult } from 'src/distributed/workers/types/order-processing-result.type';

@Injectable()
export class OrdersRepository {
  async findById(id: number, currentUser: CurrentUserDto) {
    const conditions = [eq(orders.id, id)];
    if (currentUser.role !== Role.ADMIN) {
      conditions.push(eq(orders.userId, currentUser.id));
    }
    return await db.query.orders.findFirst({
      where: and(...conditions),
    });
  }

  async findAll(currentUser: CurrentUserDto) {
    switch (currentUser.role) {
      case Role.ADMIN.toString():
        return await db.query.orders.findMany({
          orderBy: (orders, { desc }) => [desc(orders.status), desc(orders.id)],
          with: {
            user: true,
            orderDetails: {
              with: {
                product: true,
              },
            },
          },
        });

      case Role.CLIENT.toString():
        return await db.query.orders.findMany({
          where: and(eq(orders.userId, currentUser.id)),
          orderBy: (orders, { desc }) => [desc(orders.status), desc(orders.id)],
          with: {
            orderDetails: {
              with: {
                product: true,
              },
            },
          },
        });

      default:
        return [];
    }
  }

  async create(
    currentUser: CurrentUserDto,
    ordenProcessingResult: OrderProcessingResult,
  ) {
    return await db.transaction(async (tx) => {
      const [createdOrder] = await tx
        .insert(orders)
        .values({
          userId: currentUser.id,
          status: OrderStatus.PENDING,
          total: ordenProcessingResult.data.total,
        })
        .returning();

      if (!createdOrder) {
        throw new ConflictException({
          message: ORDER_ERROR_CODES.ORDER_DETAILS_INVALID,
        });
      }

      const orderDetailsToInsert = ordenProcessingResult.data.orderDetails.map(
        (detail) => ({
          ...detail,
          orderId: createdOrder.id,
        }),
      );

      const insertedOrderDetails = await tx
        .insert(orderDetails)
        .values(orderDetailsToInsert)
        .returning();

      if (insertedOrderDetails.length !== orderDetailsToInsert.length) {
        throw new ConflictException({
          message: ORDER_ERROR_CODES.ORDER_DETAILS_INVALID,
        });
      }

      return {
        ...createdOrder,
        orderDetails: orderDetailsToInsert,
      };
    });
  }

  async updateStatus(
    id: number,
    status: OrderStatus,
    currentUser: CurrentUserDto,
  ) {
    const conditions = [eq(orders.id, id)];
    if (currentUser.role !== Role.ADMIN) {
      conditions.push(eq(orders.userId, currentUser.id));
    }

    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(and(...conditions))
      .returning();
    return updatedOrder;
  }
}
