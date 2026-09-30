import { Injectable } from '@nestjs/common';
import { ProductNavigationStrategy } from './product-navigation.strategy';
import { ProductsRepository } from '../products.repository';
import { ProductQueryDto } from '../dto/product-query.dto';
import { CurrentUserDto } from 'src/shared/domain/current-user.dto';

@Injectable()
export class MenuNavigationStrategy implements ProductNavigationStrategy {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(currentUser: CurrentUserDto, query: ProductQueryDto) {
    return this.productsRepository.findAll(currentUser.role.toString(), {
      ...query,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 12,
    });
  }
}
