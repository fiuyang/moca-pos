import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { plainToInstance } from 'class-transformer';
import { CustomerResponse } from './dto/response-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<void> {
    const customer = this.customerRepo.create(createCustomerDto);
    await this.customerRepo.save(customer);
  }

  async findAll(): Promise<CustomerResponse[]> {
    const data =  await this.customerRepo.find();
    return plainToInstance(CustomerResponse, data, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<CustomerResponse> {
    const data = await this.customerRepo.findOne({
      where: { id: id },
    });
    if (!data) {
      throw new NotFoundException('Customer not found');
    }
    return plainToInstance(CustomerResponse, data, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<void> {
    const customer = await this.customerRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    Object.assign(customer, updateCustomerDto);
    await this.customerRepo.save(customer);
  }

  async remove(id: string): Promise<void> {
    const result = await this.customerRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Customer not found');
    }
  }
}
