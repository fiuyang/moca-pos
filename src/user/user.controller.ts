import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors, Query, UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JsonErrorResponse, JsonPagingResponse, JsonSuccessResponse } from '../common/decorator/response.decorator';
import { JsonBadRequestDto } from '../common/dto/api-response.dto';
import { apiResponse } from '../common/helper/web.helper';
import { ApiListResponse } from '../common/decorator/list.decorator';
import { ParamInterceptor } from '../common/interceptor/param.interceptor';
import { WebResponse } from '../common/interface/web-response.interface';
import { UserResponse } from './dto/response-user.dto';
import { ProductResponse } from '../product/dto/response-product.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  @JsonSuccessResponse(null, 201, 'User successfully created')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async create(@Body() createUserDto: CreateUserDto): Promise<WebResponse<null>> {
    await this.userService.create(createUserDto);
    return apiResponse(201, 'User successfully created');
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All user' })
  @JsonPagingResponse(UserResponse, 200, 'Success', true)
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findAll(@Query() filter: FilterUserDto): Promise<WebResponse<UserResponse[]>> {
    const { data, paging }  = await this.userService.findAll(filter);
    return apiResponse(200, 'Success', data, paging);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'First user' })
  @JsonSuccessResponse(UserResponse, 200, 'Success')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async findOne(@Param('id') id: string): Promise<WebResponse<UserResponse>> {
    const data = await this.userService.findOne(id);
    return apiResponse(200, 'Success', data);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user' })
  @ApiBody({ type: UpdateUserDto })
  @JsonSuccessResponse(null, 200, 'User successfully updated')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  @UseInterceptors(ParamInterceptor)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<WebResponse<null>> {
    await this.userService.update(id, updateUserDto);
    return apiResponse(200, 'User successfully updated');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user' })
  @JsonSuccessResponse(null, 200, 'User successfully deleted')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async remove(@Param('id') id: string): Promise<WebResponse<null>> {
    await this.userService.remove(id);
    return apiResponse(200, 'User successfully deleted');
  }
}
