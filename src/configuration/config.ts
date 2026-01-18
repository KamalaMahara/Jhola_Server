import { config } from "dotenv";
config();

export const envConfig = {
  port: Number(process.env.PORT) || 8000,
  connectionString: process.env.CONNECTION_STRING!,
  jwtSecretKey: process.env.JWT_SECRET_KEY!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN!,
  email: process.env.EMAIL,
  otpEmailPassword: process.env.OTP_EMAIL_PASSWORD
};
