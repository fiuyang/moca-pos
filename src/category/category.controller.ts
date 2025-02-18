import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JsonErrorResponse, JsonSuccessResponse } from '../common/decorator/response.decorator';
import { JsonBadRequestDto } from '../common/dto/api-response.dto';
import { ApiListResponse } from '../common/decorator/list.decorator';
import { WebResponse } from '../common/interface/web-response.interface';
import { apiResponse } from '../common/helper/web.helper';
import { CategoryResponse } from './dto/response-category.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Category')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create category' })
  @ApiBody({ type: CreateCategoryDto })
  @JsonSuccessResponse(null, 201, 'Category successfully created')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<WebResponse<null>> {
    await this.categoryService.create(createCategoryDto);
    return apiResponse(201, 'Category successfully created');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All category' })
  @ApiListResponse(CategoryResponse)
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findAll(): Promise<WebResponse<CategoryResponse[]>> {
    const data = await this.categoryService.findAll();
    return apiResponse(200, 'Success', data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'First category' })
  @JsonSuccessResponse(CategoryResponse, 200, 'Success')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findOne(@Param('id') id: string): Promise<WebResponse<CategoryResponse>> {
    const data = await this.categoryService.findOne(id);
    return apiResponse(200, 'Success', data);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update category' })
  @ApiBody({ type: UpdateCategoryDto })
  @JsonSuccessResponse(null, 200, 'Category successfully updated')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<WebResponse<null>> {
    await this.categoryService.update(id, updateCategoryDto);
    return apiResponse(200, 'Category successfully updated');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete category' })
  @JsonSuccessResponse(null, 200, 'Category successfully deleted')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async remove(@Param('id') id: string): Promise<WebResponse<null>> {
    await this.categoryService.remove(id);
    return apiResponse(200, 'Category successfully deleted');
  }
}
