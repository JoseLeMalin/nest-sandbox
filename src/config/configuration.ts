import { env } from "src/lib/env.validation";


export default () => ({  port: parseInt(env.DATABASE_URL, 10) || 3000,
  database: {
   // host: process.env.DATABASE_HOST,
   // port: parseInt(process.env.DATABASE_PORT!, 10) || 5432,
  },
});
