import { CurrentUserDto } from 'src/shared/domain/current-user.dto';
import { ProductQueryDto } from '../dto/product-query.dto';
import { ProductResponseDto } from '../dto/product-response.dto';

interface ProductNavigationResult {
  items: ProductResponseDto[];
  total: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface ProductNavigationStrategy {
  execute(
    currentUser: CurrentUserDto,
    query: ProductQueryDto,
  ): Promise<ProductNavigationResult>;
}
