"use strict";

/**
 * Requires
 */
import { describe, test, expect, afterAll } from "@jest/globals";

/**
 * Library under test
 */
import type { RedisClientType, SetOptions } from "redis";
import { createClient } from "redis";

/**
 * Variables
 */
let redisClient: RedisClientType;
let isReady: boolean;

afterAll(async () => {
  if (null != redisClient) {
    await redisClient.quit();
  }
});

/**
 * Get Cache Options
 * @interface DemoCreateClientOptions
 */
interface DemoCreateClientOptions {
  name: string;
  dbIndex: number;
  redisUrl: string;
}

/**
 * Default Get Cache Options
 * @type defaultDemoCreateClientOptions
 * @constant
 * @description name: "default", dbIndex: 0, redisUrl: "redis://localhost:6379"
 */
const defaultDemoCreateClientOptions: DemoCreateClientOptions = {
  name: "default",
  dbIndex: 0,
  redisUrl: "redis://localhost:6379",
};

/**
 * Get Cache Connection, please call .quit() on the client when done
 * @param options - GetCacheOptions
 * @returns Promise<RedisClientType>
 */
async function getCache(
  options?: DemoCreateClientOptions
): Promise<RedisClientType> {
  if (!options) {
    options = defaultDemoCreateClientOptions;
  }

  if (!isReady) {
    redisClient = createClient({
      url: options.redisUrl,
      database: options.dbIndex,
      name: options.name,
    });

    redisClient.on("error", (err) => console.log(`Cache Error: ${err}`));
    redisClient.on("connect", () => console.log("Cache connected"));
    redisClient.on("reconnecting", () => console.log("Cache reconnecting"));
    redisClient.on("ready", () => {
      isReady = true;
      console.log("Cache ready!");
    });

    await redisClient.connect();
  }
  return redisClient;
}

/**
 * Connectivity tests
 */
describe("Connectivity Stuff", () => {
  test("Open-Ready", async () => {
    const client = await getCache();

    expect(await client.isOpen).toBe(true);
    expect(await client.isReady).toBe(true);
  });
});

/**
 * Key Pair tests
 */
describe("Key Pairs", () => {
  test("key write/read (1)", async () => {
    const client = await getCache(defaultDemoCreateClientOptions);

    const key: string = "key1";
    const value: string = "value1";

    const expirationMinutes: number = 30;
    const expirationSeconds: number = expirationMinutes * 60;

    // Absolue expiration time in seconds
    const setOptions: SetOptions = {
      EX: expirationSeconds,
    };

    await client.set(key, value, setOptions);
    const v2 = await client.get(key);
    expect(v2).toBe(value);
  });

  test("key write/read (2)", async () => {
    // Custom Options from default
    const myOptions: DemoCreateClientOptions = defaultDemoCreateClientOptions;
    myOptions.name = "test2";
    myOptions.dbIndex = 3;

    const client = await getCache(myOptions);

    const key: string = "key2";
    const value: string = "value2";

    const expirationMinutes: number = 5;
    const expirationSeconds: number = expirationMinutes * 60;

    // Absolue expiration time in seconds
    const setOptions: SetOptions = {
      EX: expirationSeconds,
    };

    // Best Practice: Explictly set options, especially expiration
    await client.set(key, value, setOptions);
    const v2 = await client.get(key);
    expect(v2).toBe(value);
  });
});
