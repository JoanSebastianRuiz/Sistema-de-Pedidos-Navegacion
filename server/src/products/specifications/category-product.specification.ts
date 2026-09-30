import { eq, SQL } from 'drizzle-orm';

import { ProductSpecification } from './product.specification';
import { products } from 'src/database/drizzle/schema';

export class CategoryProductSpecification implements ProductSpecification {
  constructor(private readonly categoryId: number) {}

  toSQL(): SQL {
    return eq(products.categoryId, this.categoryId);
  }
}
