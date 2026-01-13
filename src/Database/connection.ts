import { Sequelize } from 'sequelize-typescript';
import { envConfig } from '../configuration/config.js';
import { User } from './Models/user.model.js';
const sequelize = new Sequelize(envConfig.connectionString as string, {
  models: [User]
})

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

sequelize.sync({ force: true })  //
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((err) => {
    console.log("Model synchronization ma error aayo", err);
  });

export default sequelize;