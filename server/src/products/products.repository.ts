import { Injectable } from '@nestjs/common';
import { and, eq, ilike, inArray, sql, SQL } from 'drizzle-orm';
import { db } from 'src/database/drizzle/client';
import { products } from 'src/database/drizzle/schema';
import { Role } from 'src/shared/domain/role.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { AndProductSpecification } from './specifications/and-product.specification';
import { CategoryProductSpecification } from './specifications/category-product.specification';
import { SearchProductSpecification } from './specifications/search-product.specification';
import { ActiveProductSpecification } from './specifications/active-product.specification';
import { ProductSpecification } from './specifications/product.specification';

@Injectable()
export class ProductsRepository {
  async findByName(name: string) {
    return await db.query.products.findFirst({
      where: eq(products.name, name),
    });
  }

  async findById(id: number) {
    return await db.query.products.findFirst({
      where: eq(products.id, id),
    });
  }

  async findByIds(...ids: number[]) {
    return await db.query.products.findMany({
      where: inArray(products.id, ids),
      with: {
        category: true,
      },
    });
  }

  async findAll(role: string, query: ProductQueryDto) {
    const { page, pageSize, search, categoryId } = query;

    const specifications: ProductSpecification[] = [];

    if (role === Role.CLIENT.toString()) {
      specifications.push(new ActiveProductSpecification());
    }

    if (search) {
      specifications.push(new SearchProductSpecification(search));
    }

    if (categoryId) {
      specifications.push(new CategoryProductSpecification(categoryId));
    }

    const specification =
      specifications.length > 0
        ? new AndProductSpecification(specifications)
        : undefined;

    const where = specification?.toSQL();

    if (!page || !pageSize) {
      const items = await db.query.products.findMany({
        with: {
          category: true,
        },
        where,
      });

      return {
        items,
        total: items.length,
      };
    }

    const offset = (page - 1) * pageSize;

    const items = await db.query.products.findMany({
      where,
      with: {
        category: true,
      },
      limit: pageSize,
      offset,
    });

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(products)
      .where(where);

    const total = Number(count);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async create(product: CreateProductDto) {
    const [createdProduct] = await db
      .insert(products)
      .values({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
      })
      .returning();
    return createdProduct;
  }

  async update(id: number, product: UpdateProductDto) {
    const [updatedProduct] = await db
      .update(products)
      .set({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
      })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async updateStatus(id: number, isActive: boolean) {
    const [updatedProduct] = await db
      .update(products)
      .set({ isActive })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async remove(id: number) {
    const [deletedProduct] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    return deletedProduct;
  }
}
