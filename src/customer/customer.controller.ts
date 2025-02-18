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
  UseInterceptors, UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JsonErrorResponse, JsonSuccessResponse } from '../common/decorator/response.decorator';
import { JsonBadRequestDto } from '../common/dto/api-response.dto';
import { apiResponse } from '../common/helper/web.helper';
import { WebResponse } from '../common/interface/web-response.interface';
import { ApiListResponse } from '../common/decorator/list.decorator';
import { ParamInterceptor } from '../common/interceptor/param.interceptor';
import { CustomerResponse } from './dto/response-customer.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('customer')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create customer' })
  @ApiBody({ type: CreateCustomerDto })
  @JsonSuccessResponse(null, 201, 'Customer successfully created')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<WebResponse<null>> {
    await this.customerService.create(createCustomerDto);
    return apiResponse(201, 'Customer successfully created');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All customer' })
  @ApiListResponse(CustomerResponse)
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findAll(): Promise<WebResponse<CustomerResponse[]>> {
    const data = await this.customerService.findAll();
    return apiResponse(200, 'Success', data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'First customer' })
  @JsonSuccessResponse(CustomerResponse, 200, 'Success')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findOne(@Param('id') id: string): Promise<WebResponse<CustomerResponse>> {
    const data = await this.customerService.findOne(id);
    return apiResponse(200, 'Success', data);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update customer' })
  @ApiBody({ type: UpdateCustomerDto })
  @JsonSuccessResponse(null, 200, 'Customer successfully updated')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  @UseInterceptors(ParamInterceptor)
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto): Promise<WebResponse<null>> {
    await this.customerService.update(id, updateCustomerDto);
    return apiResponse(200, 'Customer successfully updated');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete customer' })
  @JsonSuccessResponse(null, 200, 'Customer successfully deleted')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async remove(@Param('id') id: string): Promise<WebResponse<null>> {
    await this.customerService.remove(id);
    return apiResponse(200, 'Customer successfully deleted');
  }
}
