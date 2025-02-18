import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseInterceptors, Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JsonErrorResponse, JsonPagingResponse, JsonSuccessResponse } from '../common/decorator/response.decorator';
import { JsonBadRequestDto } from '../common/dto/api-response.dto';
import { ParamInterceptor } from '../common/interceptor/param.interceptor';
import { apiResponse } from '../common/helper/web.helper';
import { WebResponse } from '../common/interface/web-response.interface';
import { ProductResponse } from './dto/response-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create product' })
  @ApiBody({ type: CreateProductDto })
  @JsonSuccessResponse(null, 201, 'Product successfully created')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async create(@Body() createProductDto: CreateProductDto): Promise<WebResponse<null>> {
    await this.productService.create(createProductDto);
    return apiResponse(201, 'Customer successfully created');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All product' })
  @JsonPagingResponse(ProductResponse, 200, 'Success', true)
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findAll(@Query() filter: FilterProductDto): Promise<WebResponse<ProductResponse[]>> {
    const { data, paging } = await this.productService.findAll(filter);
    return apiResponse(200, 'Success', data, paging);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'First product' })
  @JsonSuccessResponse(ProductResponse, 200, 'Success')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findOne(@Param('id') id: string): Promise<WebResponse<ProductResponse>> {
    const data = await this.productService.findOne(id);
    return apiResponse(200, 'Success', data);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update product' })
  @ApiBody({ type: UpdateProductDto })
  @JsonSuccessResponse(null, 200, 'Product successfully updated')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  @UseInterceptors(ParamInterceptor)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<WebResponse<null>> {
    await this.productService.update(id, updateProductDto);
    return apiResponse(200, 'Product successfully updated');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete product' })
  @JsonSuccessResponse(null, 200, 'Product successfully deleted')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async remove(@Param('id') id: string): Promise<WebResponse<null>> {
    await this.productService.remove(id);
    return apiResponse(200, 'Product successfully deleted');
  }
}
