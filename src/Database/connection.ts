import { Sequelize } from 'sequelize-typescript';
import { envConfig } from '../configuration/config.js';
import User from './models/user.model.js'; // adjust path

const sequelize = new Sequelize(envConfig.connectionString, {
  models: [User], // register explicitly
});


try {
  await sequelize.authenticate();
  console.log("connected");
} catch (err) {
  console.log("error", err);
}

sequelize.sync({ force: false, alter: false }).then(() => {
  console.log("synced");
});

export default sequelize;