const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();
  }

  async set(key, value, expirationInSecond = 1800) {
    console.log(`set data to cache:${key}`);
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new Error('Cache not found');
    console.log(`get data from cache:${key}`);

    return result;
  }

  delete(key) {
    console.log(`delete: ${key}`);
    return this._client.del(key);
  }
}

module.exports = CacheService;
