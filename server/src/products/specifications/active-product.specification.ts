import { eq, SQL } from 'drizzle-orm';

import { ProductSpecification } from './product.specification';
import { products } from 'src/database/drizzle/schema';

export class ActiveProductSpecification implements ProductSpecification {
  toSQL(): SQL {
    return eq(products.isActive, true);
  }
}
