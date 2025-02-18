import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExistValidator } from './common/validator/exist.validator';
import { UniqueValidator } from './common/validator/unique.validator';
import { CommonModule } from './common/common.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { SaleModule } from './sale/sale.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*.{ts,.js}'],
        migrationsRun: true,
        synchronize: configService.get<boolean>('DB_SYNC'),
      }),
    }),
    CommonModule,
    UserModule,
    CustomerModule,
    CategoryModule,
    ProductModule,
    SaleModule,
  ],
  controllers: [],
  providers: [ExistValidator, UniqueValidator],
  exports: [TypeOrmModule]
})
export class AppModule {}

