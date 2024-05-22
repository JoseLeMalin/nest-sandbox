import { redisClient } from "src/config/redis.config";import { users } from "assets/data/users.json";

export const getOrSetCache = async (key: string, cb?: unknown) => {
  return new Promise(async (resolve, reject) => {
    console.log("key", key, cb);

    const client = await redisClient();
    client
      .get(key)
      .then((data) => {
        if (data) {
          console.log("data", data);
          return resolve(JSON.parse(data));
        } else {
          client.set(key, "Je suis un test de setorcache");
        }
      })
      .catch((error) => {
        console.log("error", error);
        return reject(error);
      });
  });
};

const loadData = async (
  jsonArray: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    numCheckins: number;
    lastCheckin: number;
    lastSeenAt: number;
  }[],
  keyName: string,
) => {
  const client = await redisClient();
  // for (const obj of jsonArray) {
  //   client.set(keyName, JSON.stringify({ ...obj }));
  // }
  client.set(keyName, JSON.stringify(jsonArray));
  // const responses = await client.rPush(keyName, );
  // let errorCount = 0;
  //
  // for (const response of responses) {
  //   if (response[0] !== null) {
  //     errorCount += 1;
  //   }
  // }

  // pipeline.quit()
  return true;
};
export const loadUsers = async () => {
  console.log("Loading user data...");

  const errorCount = await loadData(users, "users");
  console.log(`User data loaded with ${errorCount} errors.`);
};
