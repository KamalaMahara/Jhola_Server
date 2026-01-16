import type { Request, Response } from "express";
import { User } from "../user.model.js";
import bcrypt from 'bcrypt';

class AuthController {

  static async registerUser(req: Request, res: Response) {
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
  static async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    // accept incoming data --> email , password from req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    // check email exist or not at first
    const [user] = await User.findAll({   //mangoose ma find --> findAll (array ma aauxa)    findById --->findByPK(object ma aauxa)  [user ] ma User model ko data object ko form ma aauxa, array destructuring grya hunale
      where: {
        email: email,

      }

    })

    // email not found 
    if (!user) {
      return res.status(404).json({ message: "no user with that email " });
    }
    else {
      // email found now check password too
      const isEqual = bcrypt.compareSync(password, user.password)
      if (!isEqual) {
        res.status(400).json({
          message: "password milena kya"
        })

      } else {
        res.status(200).json({
          message: "logged in success 😊"
        })
      }


    }

    //if password milyo vane token generate garne (jwt)
  }
}
export default AuthController