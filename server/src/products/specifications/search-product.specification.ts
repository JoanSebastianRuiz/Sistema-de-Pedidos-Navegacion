import { ilike, SQL } from 'drizzle-orm';

import { ProductSpecification } from './product.specification';
import { products } from 'src/database/drizzle/schema';

export class SearchProductSpecification implements ProductSpecification {
  constructor(private readonly search: string) {}

  toSQL(): SQL {
    return ilike(products.name, `%${this.search}%`);
  }
}
