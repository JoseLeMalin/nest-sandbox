import { createClient } from "redis";// https://github.com/redis/node-redis/issues/1732#issuecomment-979977316
type RedisClient = ReturnType<typeof createClient>;
type TredisClient = {
  redisClient: RedisClient;
};

export const redisClient = async (): Promise<TredisClient> => {
  const client = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  return { redisClient: client };

  //The above code connects to localhost on port 6379. To connect to a different host or port, use a connection string in the format redis[s]://[[username][:password]@][host][:port][/db-number]:
  // createClient({
  // url: 'redis://alice:foobared@awesome.redis.server:6380'
  // });
};
