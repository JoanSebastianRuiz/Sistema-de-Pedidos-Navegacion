import { relations } from 'drizzle-orm';
import { orderDetails } from '../orderDetails/order-details.schema';
import { products } from './products.schema';
import { categories } from '../categories/categories.schema';

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderDetails: many(orderDetails),
}));
