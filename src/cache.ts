import Redis, { RedisOptions } from 'ioredis';
import { isEmpty, isNil } from 'lodash';

const {
  REDIS_HOST: cacheHost,
  REDIS_PORT: cachePort,
  REDIS_USERNAME: username,
  REDIS_PASSWORD: password,
  REDIS_TLS_ENABLE: tlsEnabled,
} = process.env;

const redisConfig: RedisOptions = {
  ...(!isEmpty(username) ? { username } : {}),
  ...(!isEmpty(password) ? { password } : {}),
  port: Number.parseInt(cachePort ?? '6379', 10),
  host: cacheHost,
  retryStrategy(attempt: number) {
    // exponential backoff strategy
    const nextSleepTime = Math.min(2 ** attempt + Math.floor(Math.random() * 5000), 3000); // never more than 3 secs;
    console.warn('cache.retrying', { attempt, nextSleepTime });
    if (attempt === 5) {
      console.error('cache.retries_exhausted', { attempt });
      return null;
    }
    return nextSleepTime;
  },
  maxRetriesPerRequest: null,
  ...(tlsEnabled === 'true' ? { tls: { rejectUnauthorized: false } } : {}),
};

export class Cache {
  private static redis: Redis | null = null;

  private static isReady = false;

  public connect(): Promise<Redis> {
    if (Cache.redis) {
      return Promise.resolve(Cache.redis);
    }
    const redis = new Redis(redisConfig);
    Cache.redis = redis;

    return new Promise((resolve, reject) => {
      redis.on('connect', () => console.info('cache.connected'));
      redis.on('ready', () => {
        console.info('cache.ready');
        Cache.isReady = true;
        resolve(redis);
      });
      redis.on('error', (error: Error) => {
        // only occurs when trying to connect but cannot do it
        console.error('cache.error', { error });
        Cache.isReady = false;
      });
      redis.on('close', () => {
        // only occurs when connection is lost
        console.warn('cache.closed');
        Cache.isReady = false;
      });
      redis.on('reconnecting', () => console.info('cache.reconnecting'));
      redis.on('end', () => {
        // only occurs when exhausted all retries to reconnect
        console.info('cache.ended');
        reject(new Error('Redis app cache ended connection'));
      });
      redis.on('wait', () => console.info('cache.waiting'));
    });
  }

  public onEnd(cbk: () => void): void {
    Cache.redis?.on('end', cbk);
  }

  private static getConnection(): Redis {
    if (Cache.isReady && Cache.redis) {
      return Cache.redis;
    }
    console.debug('cache.error.get_connection_failed');
    throw new Error('Redis cache is not connected');
  }

  public async shutdown(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!Cache.redis || Cache.isReady) return resolve();

      return Cache.redis.quit((error) => {
        if (!error) return resolve();

        Cache.redis?.disconnect();
        reject(error);
      });
    });
  }

  private static stringifyValue(value: unknown): string {
    try {
      return JSON.stringify(value);
    } catch (error: unknown) {
      console.error('cache.error.stringify_value', { error });
      throw new Error('Failed while stringify, probably a cyclical object');
    }
  }

  public static async set(key: string, value: unknown, ttl?: number): Promise<void> {
    if (isNil(value)) {
      console.error('cache.error.set.attempt_to_set_with_value_null_or_undefined');
      throw new Error('Value is null or undefined');
    }

    const redis = Cache.getConnection();

    const v = typeof value === 'string' ? value : Cache.stringifyValue(value);
    await (ttl ? redis.setex(key, ttl, v) : redis.set(key, v));

    console.debug('cache.set.successfully');
  }

  public static async get<T = unknown>(key: string): Promise<T | undefined> {
    const redis = Cache.getConnection();
    const value = await redis.get(key);

    if (isNil(value)) {
      console.info('cache.get.miss', { key });
      return undefined;
    }

    console.info('cache.get.hit', { key });
    try {
      return JSON.parse(value) as T;
    } catch (error: unknown) {
      console.error('cache.hit.error_parsing', { error, key });
      await redis.del(key); // remove key, value from cache
      return undefined; // do not explode if cache does not work for this value
    }
  }
}
