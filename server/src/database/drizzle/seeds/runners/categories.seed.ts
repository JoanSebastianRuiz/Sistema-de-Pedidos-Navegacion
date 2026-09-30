import { db } from '../../client';
import { promises as fs } from 'fs';
import path from 'path';
import { categories } from '../../schema';

export async function seedCategories() {
  const filePath = path.resolve(__dirname, '../data/categories.json');
  const data = await fs.readFile(filePath, 'utf-8');
  const categoriesData = JSON.parse(data);
  await db.insert(categories).values(categoriesData).onConflictDoNothing();
}
