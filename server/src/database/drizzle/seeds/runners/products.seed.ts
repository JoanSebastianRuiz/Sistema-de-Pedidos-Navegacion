import { db } from '../../client';
import { promises as fs } from 'fs';
import path from 'path';
import { products } from '../../schema';

export async function seedProducts() {
  const filePath = path.resolve(__dirname, '../data/products.json');
  const data = await fs.readFile(filePath, 'utf-8');
  const productsData = JSON.parse(data);
  await db.insert(products).values(productsData).onConflictDoNothing();
}
