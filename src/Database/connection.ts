import { Sequelize } from 'sequelize-typescript';
import { envConfig } from '../configuration/config.js';

const sequelize = new Sequelize(envConfig.connectionString as string)

try {
  sequelize.authenticate()
    .then(() => {
      console.log("authentication milyo haii")
    })
    .catch((err) => {
      console.log("authentication ma error aayo", err);
    })

} catch (error) {
  console.log(error)
}

export default sequelize;