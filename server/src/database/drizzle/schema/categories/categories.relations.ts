import { relations } from 'drizzle-orm';
import { categories } from './categories.schema';
import { products } from '../products/products.schema';

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));
