import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserResponse } from '../user/dto/response-user.dto';
import { User } from '../user/entities/user.entity';
import { comparePassword } from '../common/util/crypto.util';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async login(user: Partial<UserResponse>) {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return {
      access_token: accessToken,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or Password is wrong');
    }
    return user;
  }

  async logout(token: string): Promise<void> {
    const decodedToken = this.jwtService.decode(token) as any;

    if (decodedToken && decodedToken.exp) {
      const expiresIn = decodedToken.exp - Math.floor(Date.now() / 1000); // count expired token
      await this.redisService.addToBlacklist(token, expiresIn);
    }
  }
}
