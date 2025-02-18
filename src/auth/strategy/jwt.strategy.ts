import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from '../../common/redis/redis.service';

export type JwtPayload = {
  sub: number;
  email: string;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('auth.jwtSecret') || 'defaultSecretxxxxx',
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    if (await this.redisService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token has been blacklisted');
    }

    return { id: payload.sub, email: payload.email };
  }
}
