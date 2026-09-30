import { SQL } from 'drizzle-orm';

export interface ProductSpecification {
  toSQL(): SQL;
}
