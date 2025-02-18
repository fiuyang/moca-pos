import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from '../common/util/crypto.util';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserResponse } from './dto/response-user.dto';
import { PagingResponse } from '../common/interface/web-response.interface';
import { paginate } from '../common/helper/paging.helper';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    await this.userRepo.save({
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
    });
  }

  async findAll(filter: FilterUserDto): Promise<{ data: UserResponse[]; paging: PagingResponse }> {
    const queryBuilder = this.userRepo.createQueryBuilder('user');

    if (filter.username) {
      queryBuilder.andWhere('user.username LIKE :username', { username: `%${filter.username}%` });
    }

    if (filter.email) {
      queryBuilder.andWhere('user.email = :email', { email: filter.email });
    }

    if (filter.start_date && filter.end_date) {
      queryBuilder.andWhere('user.created_at BETWEEN :start_date AND :end_date', {
        start_date: filter.start_date,
        end_date: filter.end_date,
      });
    }

    const { data, paging } = await paginate(queryBuilder, filter);

    const response = plainToInstance(UserResponse, data, {
      excludeExtraneousValues: true,
    });

    return {
      data: response,
      paging,
    };
  }

  async findOne(id: string): Promise<UserResponse> {
    const data = await this.userRepo.findOne({
      where: { id: id },
    });
    if (!data) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(UserResponse, data, {
      excludeExtraneousValues: true,
    });
  }

  async findByEmail(email: string): Promise<User> {
    const data = await this.userRepo.findOne({
      where: {
        email,
      },
    });
    if (!data) {
      throw new NotFoundException('User not found');
    }
    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const existingUser = await this.userRepo.findOne({ where: { id: id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    Object.assign(existingUser, updateUserDto);

    if (
      updateUserDto.password &&
      updateUserDto.password !== existingUser.password
    ) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    } else {
      updateUserDto.password = existingUser.password;
    }

    Object.assign(existingUser, updateUserDto);

    await this.userRepo.save(existingUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }
}
