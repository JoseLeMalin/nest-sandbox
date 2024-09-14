import { getRedisClient } from "../../config/redis.config";
let sha: string;

/**
 * Get the Lua source code for the script.
 * @returns {string} - Lua source code for the script.
 * @private
 */
const getSource = () => `
  local key = KEYS[1]
  local new = ARGV[1]
  local current = redis.call('GET', key)

  if (current == false) or (tonumber(new) < tonumber(current)) then
    redis.call('SET', key, new)
    return 1
  else
    return 0
  end;
`;

export const load = async () => {
  const client = await getRedisClient();

  // Load script on first use...
  if (!sha) {
    sha = await client.scriptLoad(getSource());
  }

  return sha;
};

export const updateIfLowest = (key: string, value: string) => [
  sha, // Script SHA
  1, // Number of Redis keys
  key,
  value,
];

// module.exports = {
//   /**
//    * Load the script into Redis and return its SHA.
//    * @returns {string} - The SHA for this script.
//    */
//   load,
// 
//   /**
//    * Build up an array of parameters that evalsha will use to run
//    * an atomic compare and update if lower operation.
//    *
//    * @param {string} key - Redis key that the script will operate on.
//    * @param {number} value - Value to set the key to if it passes the
//    *   comparison test.
//    * @returns {number} - 1 if the update was performed, 0 otherwise.
//    */
//   updateIfLowest,
// };
