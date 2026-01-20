import type { Request, Response } from "express";
import User from "../Database/models/user.model.js";
import bcrypt from 'bcrypt';
import generatetoken from "../services/generateToken.js";
import generateToken from "../services/generateToken.js";
import generateOtp from "../services/generateOtp.js";
import sendMail from "../services/sendMail.js";

class AuthController {

  static async registerUser(req: Request, res: Response) {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    //check whether the email is already registered or not
    const [data] = await User.findAll({
      where: {
        email
      }
    })
    if (data) {
      res.status(400).json({
        message: "please try again later"
      })
      return
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
  static async verifyOtp(req: Request, res: Response) {
    const { email, otp } = req.body
    if (!email || !otp) {
      return res.status(400).json({
        message: "please provide email and otp"
      })
    }
    // check if that otp is correct or not of that email
    const [userExists] = await User.findAll({
      where: { email }
    })
    if (!userExists) {
      return res.status(404).json({
        message: "email is not registerrerd"
      })
    }
    // check if otp matches
    if (userExists.otp !== otp) {
      return res.status(400).json({
        message: "entered OTP is invalid"
      })
    }
    //check otp  expiration (2 minutes = 120000 ms)
    const otpAge = Date.now() - Number(userExists.otpGeneratedTime);
    if (otpAge > 120000) {
      return res.status(400).json({ message: "OTP has expired" });
    }


    else {
      //expire the otp so thaa it canno be used next time with the same otp
      userExists.otp = null
      userExists.isOtpVerified = true
      userExists.otpGeneratedTime = null
      await userExists.save()
      res.status(200).json({
        message: "otp is correct"
      })
    }
  }
  static async resetpassword(req: Request, res: Response) {
    const { email, newPassword, confirmPassword } = req.body
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: " please provide email,newPassword,confirmPassword"
      })
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "newpassword and confirmpassword doesnt match "
      })
    }

    const [userExists] = await User.findAll({
      where: { email }
    })
    if (!userExists) {
      return res.status(404).json({
        message: "email is not registerrerd"
      })
    }
    if (userExists.isOtpVerified !== true) {
      return res.status(403).json({
        message: "otp is successfully verified now you cant reuse this otp again"
      })

    }

    userExists.password = bcrypt.hashSync(newPassword, 10);
    userExists.isOtpVerified = false


    await userExists.save()

    res.status(200).json({
      message: "Password changed successfully"
    })

  }


}
export default AuthController