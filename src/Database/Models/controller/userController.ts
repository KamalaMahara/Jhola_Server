import type { Request, Response } from "express";
import { User } from "../user.model.js";
import bcrypt from 'bcrypt';

class AuthController {
  async registerUser(req: Request, res: Response) {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
      role
    })

    res.status(201).json({ message: "User registered successfully." });
  }
}
export { AuthController }