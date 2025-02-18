import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { DataSource, In, QueryRunner, Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { SaleItem } from './entities/sale-item.entity';
import { plainToInstance } from 'class-transformer';
import { SaleResponse } from './dto/response-sale.dto';
import { paginate } from 'src/common/helper/paging.helper';
import { FilterSaleDto } from './dto/filter-sale.dto';
import { PagingResponse } from '../common/interface/web-response.interface';
import * as ExcelJS from 'exceljs';

@Injectable()
export class SaleService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // Step 1: Generate Sale Code
      const saleCode = await this.autoGenerateCode(queryRunner, new Date());

      // Step 2: Get all product IDs from the request
      const productIds = createSaleDto.products.map(
        (productData) => productData.product_id,
      );
      const products = await queryRunner.manager.find(Product, {
        where: { id: In(productIds) },
      });

      // Step 3: Map products by ID for easy lookup
      const productMap = new Map(
        products.map((product) => [product.id, product]),
      );

      // Step 4: Create Sale Items with stock validation
      let totalAmount = 0;
      const saleItems = createSaleDto.products.map((productData) => {
        const product = productMap.get(productData.product_id);

        if (!product) {
          throw new BadRequestException(
            `Product with ID ${productData.product_id} not found`,
          );
        }

        // Validate stock availability
        if (productData.stock > product.stock) {
          throw new BadRequestException(
            `Insufficient stock for product ID ${productData.product_id}. Available stock: ${product.stock}, requested: ${productData.stock}`,
          );
        }

        const subtotal = productData.stock * product.price;
        totalAmount += subtotal; // Accumulate subtotal to totalAmount

        return queryRunner.manager.create(SaleItem, {
          product: { id: productData.product_id },
          quantity: productData.stock,
          price: product.price,
          subtotal: subtotal,
        });
      });

      const createdSaleItems = await Promise.all(saleItems);

      // Step 5: Create and save the Sale with dynamic total_amount
      const sale = queryRunner.manager.create(Sale, {
        code: saleCode,
        purchase_date: createSaleDto.purchase_date,
        total_amount: totalAmount,
        payment_method: createSaleDto.payment_method,
        change: createSaleDto.payment_amount - totalAmount,
        customer: { id: createSaleDto.customer_id },
        user: { id: createSaleDto.user_id },
      });

      const savedSale = await queryRunner.manager.save(sale);

      // Step 6: Update Sale Items with sale_id
      createdSaleItems.forEach((item) => {
        item.sale = savedSale;
      });

      // Step 7: Save Sale Items
      await queryRunner.manager.save(SaleItem, createdSaleItems);

      // Step 8: Deduct stock for each product
      for (const productData of createSaleDto.products) {
        const product = productMap.get(productData.product_id);
        if (!product) {
          throw new BadRequestException(
            `Product with ID ${productData.product_id} not found`,
          );
        }
        product.stock -= productData.stock; // Deduct the stock
        await queryRunner.manager.save(product); // Update the product stock
      }

      // Step 9: Validate total_amount
      const calculatedTotalAmount = createdSaleItems.reduce(
        (acc, item) => acc + item.subtotal,
        0,
      );
      if (totalAmount !== calculatedTotalAmount) {
        throw new BadRequestException(
          `Total amount mismatch. Calculated: ${calculatedTotalAmount}, Provided: ${totalAmount}`,
        );
      }

      // Step 10: Commit the transaction
      await queryRunner.commitTransaction();
      await queryRunner.release();

      console.log('Sale successfully created with code:', savedSale.code);
      return savedSale.code;
    } catch (error) {
      console.error('Error occurred during sale creation:', error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }

  async findAll(
    filter: FilterSaleDto,
  ): Promise<{ data: SaleResponse[]; paging: PagingResponse }> {
    const queryBuilder = this.saleRepo
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.user', 'user')
      .leftJoinAndSelect('sale.customer', 'customer')
      .leftJoinAndSelect('sale.saleItems', 'saleItems')
      .leftJoinAndSelect('saleItems.product', 'product');

    if (filter.code) {
      queryBuilder.andWhere('sale.code LIKE :code', {
        code: `%${filter.code}%`,
      });
    }

    if (filter.start_date && filter.end_date) {
      queryBuilder.andWhere(
        'sale.purchase_date BETWEEN :start_date AND :end_date',
        {
          start_date: filter.start_date,
          end_date: filter.end_date,
        },
      );
    }

    const { data, paging } = await paginate(queryBuilder, filter);

    const response = plainToInstance(SaleResponse, data, {
      excludeExtraneousValues: true,
    });

    return {
      data: response,
      paging,
    };
  }

  async findOne(id: string): Promise<SaleResponse> {
    const data = this.saleRepo.findOne({
      where: { id },
      relations: ['user', 'customer', 'saleItems', 'saleItems.product'],
    });
    if (!data) {
      throw new NotFoundException('Sale not found');
    }
    return plainToInstance(SaleResponse, data, {
      excludeExtraneousValues: true,
    });
  }

  async generateReport(filter: FilterSaleDto): Promise<ExcelJS.Buffer> {
    const { data: salesData } = await this.findAll(filter);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Report');

    worksheet.columns = [
      { header: 'Sale Code', key: 'code', width: 20 },
      { header: 'Customer Name', key: 'customer_name', width: 30 },
      { header: 'Cashier', key: 'cashier', width: 30 },
      { header: 'Purchase Date', key: 'purchase_date', width: 20 },
      { header: 'Total Amount', key: 'total_amount', width: 15 },
      { header: 'Change', key: 'change', width: 15 },
      { header: 'Payment Method', key: 'payment_method', width: 15 },
    ];

    salesData.forEach((sale) => {
      worksheet.addRow({
        code: sale.code,
        customer_name: sale.customer?.name || 'N/A',
        cashier: sale.user?.username || 'N/A',
        purchase_date: sale.purchase_date
          ? new Date(sale.purchase_date).toLocaleDateString()
          : 'N/A',
        total_amount: sale.total_amount || 0,
        change: sale.change || 0,
        payment_method: sale.payment_method || 'N/A',
      });
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
      };
    });

    // Write the Excel file to the response stream
    return await workbook.xlsx.writeBuffer();
  }

  async autoGenerateCode(
    queryRunner: QueryRunner,
    date: Date,
  ): Promise<string> {
    // Step 1: Format date as YYYYMMDD
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const datePrefix = `${year}${month}${day}`; // 20250218

    // Step 2: Find the latest record for the same date
    const lastRecord = await queryRunner.manager
      .createQueryBuilder(Sale, 'sale')
      .where('sale.code LIKE :codePrefix', { codePrefix: `${datePrefix}%` })
      .orderBy('sale.created_at', 'DESC')
      .setLock('pessimistic_write')
      .getOne();

    // Step 3: Extract the sequence from the latest record's code and increment it
    let newSequenceNumber = 1;
    if (lastRecord && lastRecord.code.startsWith(datePrefix)) {
      const lastSequence = parseInt(lastRecord.code.substring(8), 10);
      newSequenceNumber = lastSequence + 1;
    }

    //025021800001
    return `${datePrefix}${newSequenceNumber.toString().padStart(6, '0')}`;
  }
}
