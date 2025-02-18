import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { plainToInstance } from 'class-transformer';
import { ProductResponse } from './dto/response-product.dto';
import { PagingResponse } from '../common/interface/web-response.interface';
import { paginate } from '../common/helper/paging.helper';
import { FilterProductDto } from './dto/filter-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<void> {
    const { category_id, ...productData } = createProductDto;

    const product = this.productRepo.create({
      ...productData,
      category: { id: category_id },
    });

    await this.productRepo.save(product);
  }

  async findAll(filter: FilterProductDto): Promise<{ data: ProductResponse[]; paging: PagingResponse }> {
    const queryBuilder = this.productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (filter.code) {
      queryBuilder.andWhere('product.code = :code', { code: filter.code });
    }

    if (filter.start_date && filter.end_date) {
      queryBuilder.andWhere('product.created_at BETWEEN :start_date AND :end_date', {
        start_date: filter.start_date,
        end_date: filter.end_date,
      });
    }

    const { data, paging } = await paginate(queryBuilder, filter);

    const response = plainToInstance(ProductResponse, data, {
      excludeExtraneousValues: true,
    });

    return {
      data: response,
      paging,
    };
  }

  async findOne(id: string): Promise<ProductResponse> {
    const data = await this.productRepo.findOne({
      where: { id: id },
    });
    if (!data) {
      throw new NotFoundException('Product not found');
    }
    return plainToInstance(ProductResponse, data, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<void> {
    const product = await this.productRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (updateProductDto.category_id) {
      product.category = { id: updateProductDto.category_id } as Category;
    }

    Object.assign(product, updateProductDto);
    await this.productRepo.save(product);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Product not found');
    }
  }
}
