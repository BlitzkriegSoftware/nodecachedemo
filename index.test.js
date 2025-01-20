"use strict";

/**
 * Requires
 */
const {
  describe,
  test,
  expect,
  afterAll,
  beforeAll,
} = require("@jest/globals");

/**
 * Library under test
 */
const { createClient } = require("redis");

/**
 * Key Store Client
 */
let client = createClient({
  url: "redis://localhost:6379",
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

/**
 * After All
 */
afterAll(async () => {
  await client.quit();
});

describe("Basic Stuff", () => {
  test("Is Open", async () => {
    expect(client.isOpen()).toBe(true);
    expect(client.isReady()).toBe(true);
  });

  test("key write/read", async () => {
    const key = "key";
    const value = "value";
    await client.set(key, value);
    const v2 = await client.get(key);
    expect(v2).toBe(value);
  });

  test("", async () => {});
  test("", async () => {});
});
