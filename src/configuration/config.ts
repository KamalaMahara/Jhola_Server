import { config } from "dotenv";
config();

export const envConfig = {
  port: process.env.port,
  connectionString: process.env.CONNECTION_STRING
}