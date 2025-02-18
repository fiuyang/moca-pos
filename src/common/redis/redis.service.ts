import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });
    this.client.connect();
  }

  async addToBlacklist(token: string, expiresIn: number): Promise<void> {
    await this.client.set(token, 'blacklisted', { EX: expiresIn });
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.client.get(token);
    return result === 'blacklisted';
  }
}
