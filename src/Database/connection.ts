import { Sequelize } from 'sequelize-typescript';
import { envConfig } from '../configuration/config.js';
import User from './models/user.model.js';
import Category from './models/categoryModel.js';
import CategoryController from '../controller/CategoryController.js';
import Product from './models/product.Model.js';

const sequelize = new Sequelize(envConfig.connectionString, {
  models: [User, Category, Product], // register explicitly
});

//relationships// 
Category.hasMany(Product, {
  foreignKey: 'categoryId'
});

Product.belongsTo(Category, { foreignKey: 'categoryId' });

try {
  await sequelize.authenticate();
  console.log("connected");
} catch (err) {
  console.log("error", err);
}

await sequelize.sync({ force: false, alter: true }).then(async () => {
  console.log("synced");
  await CategoryController.seedCategory()
});





export default sequelize;