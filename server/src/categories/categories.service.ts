import { ConflictException, Injectable } from '@nestjs/common';
import { CATEGORY_ERROR_CODES } from 'src/shared/errors';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoriesRepository.findByName(
      createCategoryDto.name,
    );

    if (existingCategory) {
      throw new ConflictException({
        message: CATEGORY_ERROR_CODES.NAME_ALREADY_EXISTS,
      });
    }

    return await this.categoriesRepository.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoriesRepository.findAll();
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.categoriesRepository.findById(id);
    if (!existingCategory) {
      throw new ConflictException({
        message: CATEGORY_ERROR_CODES.CATEGORY_NOT_FOUND,
      });
    }

    const categoryWithSameName = await this.categoriesRepository.findByName(
      updateCategoryDto.name!,
    );

    if (categoryWithSameName && categoryWithSameName.id !== id) {
      throw new ConflictException({
        message: CATEGORY_ERROR_CODES.NAME_ALREADY_EXISTS,
      });
    }

    return await this.categoriesRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    const existingCategory = await this.categoriesRepository.findById(id);
    if (!existingCategory) {
      throw new ConflictException({
        message: CATEGORY_ERROR_CODES.CATEGORY_NOT_FOUND,
      });
    }
    return await this.categoriesRepository.remove(id);
  }
}
