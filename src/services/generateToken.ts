import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { envConfig } from "../configuration/config.js";

const generateToken = (userid: string): string => {
  const secret: Secret = envConfig.jwtSecretKey;

  const options: SignOptions = {};

  if (envConfig.jwtExpiresIn) {
    options.expiresIn = envConfig.jwtExpiresIn as StringValue;
  }

  return jwt.sign({ userid }, secret, options);
};

export default generateToken;
