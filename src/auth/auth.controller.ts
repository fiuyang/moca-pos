import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { WebResponse } from '../common/interface/web-response.interface';
import { apiResponse } from '../common/helper/web.helper';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JsonErrorResponse, JsonSuccessResponse } from '../common/decorator/response.decorator';
import { JsonBadRequestDto } from '../common/dto/api-response.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessTokenDto, LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'Login user' })
  @JsonSuccessResponse(AccessTokenDto, 200, 'User successfully login')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(500, 'Internal Server Error')
  async login(
    @Request() req: any,
  ): Promise<WebResponse<{ access_token: string }>> {
    const token = await this.authService.login(req.user);
    return apiResponse(HttpStatus.OK, 'User successfully login', token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @JsonSuccessResponse(null, 200, 'Logout successfully')
  @JsonErrorResponse(401, 'Record Not Found')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: JsonBadRequestDto,
  })
  @JsonErrorResponse(403, 'Forbidden')
  @JsonErrorResponse(401, 'Unauthorized')
  @JsonErrorResponse(500, 'Internal Server Error')
  async logout(@Req() req): Promise<WebResponse<string>> {
    if (!req.headers.authorization) {
      throw new BadRequestException('Authorization header is missing');
    }
    const token = req.headers.authorization.split(' ')[1];
    await this.authService.logout(token);
    return apiResponse(200, 'Logout successfully');
  }
}
