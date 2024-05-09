/* import { createEnv } from "@t3-oss/env-core";import { z } from "zod";export const env = createEnv({
  // Tell the library when we're in a server context.
  isServer: typeof window === "undefined",
  server: {
    DATABASE_URL: z.string().url(),
    POSTGRES_DB: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRESDB_ROOT_PASSWORD: z.string(),
    POSTGRESDB_LOCAL_PORT: z.number(),
    POSTGRESDB_DOCKER_PORT: z.string(),
    POSTGRES_SYNCHRONIZE: z.string(),
  },
  clientPrefix: "PUBLIC_",
  client: {
    // Nothing here yet
  },
  // Maybe you can use just `runtimeEnv` if there is a MAJ.
  // Please follow the docs : https://env.t3.gg/docs/nextjs#create-your-schema
  // experimental__runtimeEnv: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
*/

export const env = {
  DATABASE_URL: "postgresql://JoseLeMalin:123456@localhost:5432/node_sandbox_db?schema=public",
  POSTGRESDB_LOCAL_PORT: 5432,
  POSTGRES_USER: "JoseLeMalin",
  POSTGRES_PASSWORD: "123456",
  POSTGRES_DB: "node-sandbox-server",
  POSTGRES_SYNCHRONIZE: "true",
};
