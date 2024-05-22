import { redisClient } from "src/config/redis.config";
import { checkins } from "assets/data/checkins.json";
import { users } from "assets/data/users.json";
import { locationDetails } from "assets/data/locationdetails.json";
import { locations } from "assets/data/locations.json";

type TLoadData = {
  jsonArray: (
    | {
        id: string;
        userId: number;
        locationId: number;
        starRating: number;
      }
    | {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        numCheckins: number;
        lastCheckin: number;
        lastSeenAt: number;
      }
    | {
        id: number;
        hours: {
          day: string;
          hours: string;
        }[];
        socials: {
          instagram: string;
          facebook: string;
          twitter: string;
        }[];
        website: string;
        description: string;
        phone: string;
      }
    | {
        id: number;
        name: string;
        category: string;
        location: string;
        numCheckins: number;
        numStars: number;
        averageStars: number;
      }
  )[];
};

export const getOrSetCache = async (key: string, cb: () => Promise<unknown>) => {
  return new Promise(async (resolve, reject) => {
    const client = (await redisClient()).redisClient;
    const result = await client
      .get(key)

      .catch((error) => {
        console.log("error", error);
        return reject(error);
      });
    if (!result || result === null) {
      const result = await cb();
      return resolve(result);
    }
    return resolve(result);
  });
};

const loadData = async (jsonArray: TLoadData, keyName: string) => {
  const client = (await redisClient()).redisClient;
  await client.set(keyName, JSON.stringify(jsonArray));
};

export const loadAll = async () => {
  await loadUsers();
  await loadCheckins();
  await loadLocationDetails();
  await loadLocations();
};

const loadUsers = async () => {
  console.log("Loading user data...");

  await loadData({ jsonArray: users }, "users");
};

const loadCheckins = async () => {
  console.log("Loading user data...");

  await loadData({ jsonArray: checkins }, "checkins");
};

const loadLocationDetails = async () => {
  console.log("Loading locationsDetails data...");

  await loadData({ jsonArray: locationDetails }, "locationDetails");
};
const loadLocations = async () => {
  console.log("Loading locations data...");

  await loadData({ jsonArray: locations }, "locations");
};
