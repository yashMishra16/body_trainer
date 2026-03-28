import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: IORedis | null = null;

function getRedisClient(): IORedis | null {
  if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
    return null;
  }

  if (!redisClient) {
    try {
      if (process.env.REDIS_URL) {
        redisClient = new IORedis(process.env.REDIS_URL, { lazyConnect: true });
      } else {
        redisClient = new IORedis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          lazyConnect: true,
          retryStrategy: (times: number) => {
            if (times > 3) return null;
            return Math.min(times * 100, 3000);
          },
        });
      }

      redisClient.on('error', (err: Error) => {
        console.warn('Redis connection error (caching disabled):', err.message);
        redisClient = null;
      });
    } catch {
      console.warn('Redis initialization failed (caching disabled)');
      return null;
    }
  }

  return redisClient;
}

export async function getCachedResponse(key: string): Promise<unknown> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const cached = await client.get(key);
    if (cached) {
      console.log(`📦 Cache hit for key: ${key.slice(0, 50)}...`);
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn('Cache get error:', error);
  }
  return null;
}

export async function setCachedResponse(
  key: string,
  value: unknown,
  ttlSeconds = 3600,
): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.setex(key, ttlSeconds, JSON.stringify(value));
    console.log(`💾 Cached response for key: ${key.slice(0, 50)}...`);
  } catch (error) {
    console.warn('Cache set error:', error);
  }
}

export async function deleteCachedResponse(key: string): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.del(key);
  } catch (error) {
    console.warn('Cache delete error:', error);
  }
}
