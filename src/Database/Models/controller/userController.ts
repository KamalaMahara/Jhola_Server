import type { Request, Response } from "express";
import { User } from "../user.model.js";
import bcrypt from 'bcrypt';
import generatetoken from "../../../services/generateToken.js";
import generateToken from "../../../services/generateToken.js";
import generateOtp from "../../../services/generateOtp.js";
import sendMail from "../../../services/sendMail.js";

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

    await sendMail({
      to: email,
      subject: " Registration successful Welcome to Jhola",

      text: " Thank you for joining and trusting us as your selling partner. We are excited to have you onboard withjhola."
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
        const token = generateToken(user.id)
        res.status(200).json({
          message: "logged in success 😊",
          token
        })
      }


    }

    //if password milyo vane token generate garne (jwt)
  }
  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body
    if (!email) {
      res.status(400).json({ message: "plz provide email" })
      return
    }


    const [user] = await User.findAll
      ({
        where: {
          email
        }
      })

    if (!user) {
      res.status(404).json({
        email: "email not registered"
      })
      return
    }
    //forgot password ko lagi otp geneerate garera,emai ma sent garne 

    const otp = generateOtp()
    sendMail({
      to: email,
      subject: "Jhola password change request ",
      text: ` you just requested to reset password of Jhola .here's your otp code,${otp}`
    })
    user.otp = otp.toString()
    user.otpGeneratedTime = Date.now().toString()
    await user.save()

    res.status(200).json({
      message: "Jhola password reset otp code sent"
    })
  }

}
export default AuthController