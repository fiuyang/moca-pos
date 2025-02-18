import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CategoryResponse } from './dto/response-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<void> {
    const category = this.categoryRepo.create(createCategoryDto);
    await this.categoryRepo.save(category);
  }

  async findAll(): Promise<CategoryResponse[]> {
    const data =  await this.categoryRepo.find({
      relations:['products']
    });

    return plainToInstance(CategoryResponse, data, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<CategoryResponse> {
    const data = await this.categoryRepo.findOne({
      where: { id: id },
    });
    if (!data) {
      throw new NotFoundException('Category not found');
    }

    return plainToInstance(CategoryResponse, data, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    Object.assign(category, updateCategoryDto);
    await this.categoryRepo.save(category);
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Category not found');
    }
  }
}
