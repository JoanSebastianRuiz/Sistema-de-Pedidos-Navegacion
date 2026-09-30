import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomThrottlerGuard } from './auth/guards/throttler.guard';
import { LoggerContextMiddleware } from './shared/middlewares/logger-context.middleware';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { WorkersModule } from './distributed/workers/workers.module';
import { GatewayModule } from './distributed/gateway/gateway.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 1000000000000000,
        getTracker: (req) => {
          const userId = req.session?.user?.id;

          if (userId) return `user:${userId}`;

          const ip = req.ip;
          const ua = req.headers['user-agent'] || 'unknown';

          return `ip:${ip}:ua:${ua}`;
        },
      },
    ]),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    WorkersModule,
    GatewayModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}
