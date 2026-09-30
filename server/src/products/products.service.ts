import { ConflictException, Injectable } from '@nestjs/common';
import { CurrentUserDto } from 'src/shared/domain/current-user.dto';
import { PRODUCT_ERROR_CODES } from 'src/shared/errors';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { CategoriesRepository } from 'src/categories/categories.repository';
import { ProductQueryDto } from './dto/product-query.dto';
import { AllProductsStrategy } from './strategies/all-products.strategy';
import { MenuNavigationStrategy } from './strategies/menu-navigation.strategy';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly allProductsStrategy: AllProductsStrategy,
    private readonly menuNavigationStrategy: MenuNavigationStrategy,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const existingCategory = await this.categoriesRepository.findById(
      createProductDto.categoryId,
    );

    if (!existingCategory) {
      throw new ConflictException({
        message: PRODUCT_ERROR_CODES.CATEGORY_NOT_FOUND,
      });
    }

    const existingProduct = await this.productsRepository.findByName(
      createProductDto.name,
    );

    if (existingProduct) {
      throw new ConflictException({
        message: PRODUCT_ERROR_CODES.NAME_ALREADY_EXISTS,
      });
    }

    return await this.productsRepository.create(createProductDto);
  }

  async findAll(currentUser: CurrentUserDto, query: ProductQueryDto) {
    if (!currentUser) {
      throw new ConflictException({
        message: PRODUCT_ERROR_CODES.USER_NOT_FOUND,
      });
    }

    return await this.menuNavigationStrategy.execute(currentUser, query);
  }

  async findAllProducts(currentUser: CurrentUserDto) {
    if (!currentUser) {
      throw new ConflictException({
        message: PRODUCT_ERROR_CODES.USER_NOT_FOUND,
      });
    }

    return await this.allProductsStrategy.execute(currentUser, {});
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const existingCategory = await this.categoriesRepository.findById(
      updateProductDto.categoryId!,
    );

    if (!existingCategory) {
      throw new ConflictException({
        message: PRODUCT_ERROR_CODES.CATEGORY_NOT_FOUND,
      });
    }

    const existingProduct = await this.productsRepository.findById(id);
    if (!existingProduct) {
      throw new ConflictException({
        message: PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND,
      });
    }

    const productWithSameName = await this.productsRepository.findByName(
      updateProductDto.name!,
    );

    if (productWithSameName && productWithSameName.id !== id) {
      throw new ConflictException({
        message: PRODUCT_ERROR_CODES.NAME_ALREADY_EXISTS,
      });
    }

    return await this.productsRepository.update(id, updateProductDto);
  }

  async updateStatus(id: number, isActive: boolean) {
    const existingProduct = await this.productsRepository.findById(id);
    if (!existingProduct) {
      throw new ConflictException({
        message: PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND,
      });
    }
    return await this.productsRepository.updateStatus(id, isActive);
  }

  async remove(id: number) {
    const existingProduct = await this.productsRepository.findById(id);
    if (!existingProduct) {
      throw new ConflictException({
        message: PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND,
      });
    }
    return await this.productsRepository.remove(id);
  }
}
