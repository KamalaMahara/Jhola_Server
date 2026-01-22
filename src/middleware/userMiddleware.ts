import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../configuration/config.js";
import User from "../Database/models/user.model.js";

export enum Roles {
  Admin = "admin",
  Customer = "customer"
}
interface IExtendedRequest extends Request {
  user?: {
    username: string,
    email: string,
    role: string,
    password: string,
    id: string
  }
}



class UserMiddleware {
  async isUserLoggedIn(req: IExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    // token receive garne
    const token = req.headers.authorization;
    if (!token) {
      res.status(403).json({
        message: "Token must be provided",
      });
      return;
    }

    jwt.verify(token, envConfig.jwtSecretKey as string, async (error, result: any) => {
      if (error) {
        res.status(403).json({
          message: "Invalid token !!",
        });
      } else {
        console.log(result);
        const userData = await User.findByPk(result.userid)
        if (!userData) {
          res.status(404).json({
            message: "no user with thtat userId"
          })
          return
        }
        req.user = userData
        next()
      }
    });
  }
  accessTo(...roles: Roles[]) {
    return (req: IExtendedRequest, res: Response, next: NextFunction) => {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(403).json({
          message: "User role not found",
        });
      }

      if (!roles.includes(userRole as Roles)) {
        return res.status(403).json({
          message: "You do not have permission to perform this action",
        });
      }

      next();
    };
  }
}

export default new UserMiddleware();