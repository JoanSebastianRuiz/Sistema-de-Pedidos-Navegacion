import { Injectable } from '@nestjs/common';
import { ProductNavigationStrategy } from './product-navigation.strategy';
import { ProductsRepository } from '../products.repository';
import { CurrentUserDto } from 'src/shared/domain/current-user.dto';
import { ProductQueryDto } from '../dto/product-query.dto';

@Injectable()
export class AllProductsStrategy implements ProductNavigationStrategy {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(currentUser: CurrentUserDto, _query: ProductQueryDto) {
    return this.productsRepository.findAll(currentUser.role.toString(), {});
  }
}
