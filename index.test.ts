"use strict";

/**
 * Requires
 */
import { describe, test, expect } from "@jest/globals";

/**
 * Library under test
 */
import type { RedisClientType } from "redis";
import { createClient } from "redis";

/**
 * Variables
 */

let redisClient: RedisClientType;
let isReady: boolean;

/**
 * Get Cache Connection
 * @returns Promise<RedisClientType>
 */
async function getCache(
  redisUrl: string = "redis://localhost:6379"
): Promise<RedisClientType> {
  if (!isReady) {
    redisClient = createClient({
      url: redisUrl,
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

describe("Connectivity Stuff", () => {
  test("Open-Ready", async () => {
    const client = await getCache();
    try {
      expect(await client.isOpen).toBe(true);
      expect(await client.isReady).toBe(true);
    } finally {
      if (null != client) {
        await client.quit();
      }
    }
  });
});

describe("Key Pairs", () => {
  test("key write/read", async () => {
    const client = await getCache();
    try {
      const key = "key";
      const value = "value";
      await client.set(key, value);
      const v2 = await client.get(key);
      expect(v2).toBe(value);
    } finally {
      if (null != client) {
        client.quit();
      }
    }
  });
});

/* describe("", () => {
  test("", async () => {
    const client = await getCache();
    try {
    } finally {
      if (null != client) {
        client.quit();
      }
    }
  });

  test("", async () => {
    const client = await getCache();
    try {
    } finally {
      if (null != client) {
        client.quit();
      }
    }
  });
}); */
