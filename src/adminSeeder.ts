import { envConfig } from "./configuration/config.js"
import User from "./Database/models/user.model.js"
import bcrypt from 'bcrypt'
const adminSeeder = async () => {
  const [data] = await User.findAll({
    where: {
      email: envConfig.adminEmail
    }
  })
  if (!data) {

    await User.create({
      username: envConfig.adminUserName,
      password: bcrypt.hashSync(envConfig.adminPassword as string, 8),
      email: envConfig.adminEmail,
      role: "admin"
    })
    console.log("admin seeded !!!")
  }
  else {
    console.log("admin already seedee !!")
  }
}
export default adminSeeder