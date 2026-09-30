import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/drizzle/client';
import { categories } from 'src/database/drizzle/schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
  async findByName(name: string) {
    return await db.query.categories.findFirst({
      where: eq(categories.name, name),
    });
  }

  async findById(id: number) {
    return await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });
  }

  async findAll() {
    return await db.query.categories.findMany();
  }

  async create(category: CreateCategoryDto) {
    const [createdCategory] = await db
      .insert(categories)
      .values({
        name: category.name,
      })
      .returning();
    return createdCategory;
  }

  async update(id: number, category: UpdateCategoryDto) {
    const [updatedCategory] = await db
      .update(categories)
      .set({
        name: category.name,
      })
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async remove(id: number) {
    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();
    return deletedCategory;
  }
}
