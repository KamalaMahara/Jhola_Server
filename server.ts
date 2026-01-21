import "./src/Database/connection.js"
import adminSeeder from './src/adminSeeder.js';
import app from './src/app.js'
import { envConfig } from './src/configuration/config.js'
import CategoryController from "./src/controller/CategoryController.js";


function startServer() {
  const port = envConfig.port || 4000;

  app.listen(port, () => {
    CategoryController.seedCategory()
    console.log(`Server is running on port ${port}`);
    adminSeeder()
  })
}
startServer();
