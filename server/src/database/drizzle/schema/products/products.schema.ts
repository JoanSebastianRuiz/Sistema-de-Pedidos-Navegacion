import {
  boolean,
  numeric,
  pgTable,
  serial,
  text,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';
import { categories } from '../categories/categories.schema';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),

  categoryId: integer('category_id')
    .references(() => categories.id)
    .notNull(),

  name: varchar('name', { length: 120 }).notNull(),

  description: text('description'),

  price: numeric('price', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),

  isActive: boolean('is_active').default(true).notNull(),
});
