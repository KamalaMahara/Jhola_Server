import app from './src/app'
import { envConfig } from './src/configuration/config'

function startServer() {
  const port = envConfig.port || 4000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
}
startServer();
