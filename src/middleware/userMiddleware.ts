import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../configuration/config.js";

class UserMiddleware {
  async isUserLoggedIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    // token receive garne
    const token = req.headers.authorization;
    if (!token) {
      res.status(403).json({
        message: "Token must be provided",
      });
      return;
    }

    jwt.verify(token, envConfig.jwtSecretKey as string, (error, result) => {
      if (error) {
        res.status(403).json({
          message: "Invalid token !!",
        });
      } else {
        console.log(result);
        next()
      }
    });
  }
}

export default new UserMiddleware();