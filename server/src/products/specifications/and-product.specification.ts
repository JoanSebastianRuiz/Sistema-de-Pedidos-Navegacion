import { and, SQL } from 'drizzle-orm';

import { ProductSpecification } from './product.specification';

export class AndProductSpecification implements ProductSpecification {
  constructor(private readonly specifications: ProductSpecification[]) {}

  toSQL(): SQL {
    return and(
      ...this.specifications.map((specification) => specification.toSQL()),
    )!;
  }
}
