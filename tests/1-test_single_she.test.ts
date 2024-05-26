import { getRedisClient } from "../src/config/redis.config"; // const config = require("better-config");

// config.set("../config.json");

// const redis = redisClient;

const testSuiteName = "site_dao_redis_impl";

const testKeyPrefix = `test:${testSuiteName}`;

// keyGenerator.setPrefix(testKeyPrefix);

// pnpm run test -- 1-test_single_she.test
/* eslint-disable no-undef */
describe("AppController (e2e)", async () => {
  const client = await getRedisClient();

  beforeAll(() => {
    jest.setTimeout(60000);
  });

  afterEach(async () => {
    const testKeys = await client.keys(`${testKeyPrefix}:*`);

    if (testKeys.length > 0) {
      await client.del(testKeys);
    }
  });

  afterAll(() => {
    // Release Redis connection.
    client.quit();
  });

  test(`${testSuiteName}: lua test`, async () => {
    // Load script and get its SHA back.
    const sha = await updateIfLowestScript.load();

    // Execute script (1 = number of Redis keys).
    const result = await client.evalshaAsync(sha, 1, key, value);

    // Check result.
    expect(result).toBe(1);
  });
});
