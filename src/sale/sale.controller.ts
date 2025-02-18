import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Query, Res, UseGuards } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JsonErrorResponse, JsonPagingResponse, JsonSuccessResponse } from '../common/decorator/response.decorator';
import { JsonBadRequestDto } from '../common/dto/api-response.dto';
import { apiResponse } from 'src/common/helper/web.helper';
import { WebResponse } from '../common/interface/web-response.interface';
import { SaleResponse } from './dto/response-sale.dto';
import { FilterSaleDto } from './dto/filter-sale.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('sale')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create sale' })
  @ApiBody({ type: CreateSaleDto })
  @JsonSuccessResponse(null, 201, 'Sale successfully created')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async create(@Body() createSaleDto: CreateSaleDto): Promise<WebResponse<string>> {
    const data = await this.saleService.create(createSaleDto);
    return apiResponse(201, 'Sale created successfully', data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All sale' })
  @JsonPagingResponse(SaleResponse, 200, 'Success', true)
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findAll(@Query() filter: FilterSaleDto): Promise<WebResponse<SaleResponse[]>> {
    const { data, paging } = await this.saleService.findAll(filter);
    return apiResponse(200, 'Success', data, paging );
  }

  @Get('generate-report')
  @ApiOperation({ summary: 'Generate Report' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Report successfully generated',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async downloadReport(@Query() filter: FilterSaleDto, @Res() res: Response) {
    const buffer = await this.saleService.generateReport(filter);

    const date = new Date();
    const timestamp = date.toISOString().replace(/[^0-9]/g, '');
    const filename = `sales_report_${timestamp}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(buffer);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'First sale' })
  @JsonSuccessResponse(SaleResponse, 200, 'Success')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findOne(@Param('id') id: string): Promise<WebResponse<SaleResponse>> {
    const data = await this.saleService.findOne(id);
    return apiResponse(200, 'Success', data);
  }
}
