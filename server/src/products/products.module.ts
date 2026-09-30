import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { AllProductsStrategy } from './strategies/all-products.strategy';
import { MenuNavigationStrategy } from './strategies/menu-navigation.strategy';

@Module({
  imports: [CategoriesModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepository,
    AllProductsStrategy,
    MenuNavigationStrategy,
  ],
  exports: [ProductsRepository],
})
export class ProductsModule {}
