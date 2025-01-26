# nodecachedemo

A demo of using Valkey-or-Redis in NodeJs along with some best practices, see comments.

## Start valkey - Docker

1. Make sure docker is running

2. run `scripts\d_valkey_start.ps1`

   - [valkey](https://github.com/valkey-io/valkey) is open source REDIS
   - Code will run with either valkey or redis

## Start valkey - podman

1. Make sure podman is running

2. run `scripts\p_valkey_start.ps1`

# Demo

Run jest tests to see demo at work

- Command line `jest`
- In VSCODE with [Jest Runner](https://open-vsx.org/extension/firsttris/vscode-jest-runner), editor will have run and debug added to tests inside the main file `index.test.ts`

## Reference

- https://github.com/redis/node-redis/tree/master/packages/redis
- Expiration of Keys: https://redis.io/docs/latest/commands/set/#:~:text=EX%20seconds%20%2D%2D%20Set%20the,milliseconds%20(a%20positive%20integer).
