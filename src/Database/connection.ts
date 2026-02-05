import { Sequelize } from 'sequelize-typescript';
import { envConfig } from '../configuration/config.js';
import User from './models/user.model.js';
import Category from './models/categoryModel.js';
import CategoryController from '../controller/CategoryController.js';
import Product from './models/product.Model.js';
import Order from './models/orderModel.js';
import Payment from './models/paymentModel.js';
import OrderDetail from './models/orderDetails.js';
import { Cart } from './models/cartModel.js';

const sequelize = new Sequelize(envConfig.connectionString, {
  models: [User, Category, Product, Order, Payment, OrderDetail, Cart], // register explicitly
});

//relationships// 
Category.hasMany(Product, {
  foreignKey: 'categoryId'
});

Product.belongsTo(Category, { foreignKey: 'categoryId' });


// User X Order relationship  --> order table ma UserId aaunu paro

User.hasMany(Order, {
  foreignKey: 'userId'
})

Order.belongsTo(User, { foreignKey: 'userId' })

//Payment X Order relationship ---.payment ma orderId
Order.hasOne(Payment, {
  foreignKey: "orderId"
})

Payment.belongsTo(Order, {
  foreignKey: 'orderId'
})

// OrderDetails X Order --> OrderDetails table ma OrderId

Order.hasOne(OrderDetail, {
  foreignKey: "orderId"
})

OrderDetail.belongsTo(Order, {
  foreignKey: "orderId"
})

//OrderDetails X Product --> oderdetails ma productId 

Product.hasMany(OrderDetail, {
  foreignKey: "productId"
})

OrderDetail.belongsTo(Product, {
  foreignKey: "productId"
})

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

//cart and user ko relation

User.hasOne(Cart, { foreignKey: "userId" })
Cart.belongsTo(User, { foreignKey: "userId" })


//product and cart
Product.hasMany(Cart, { foreignKey: "productId" }),
  Cart.belongsTo(Product, { foreignKey: "productId" })


export default sequelize;