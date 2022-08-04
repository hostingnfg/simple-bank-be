import express, { Express } from 'express';
import dotenv from 'dotenv';

import bodyParser from 'body-parser';
import UsersController from "./controllers/users.controller";
import AccountsController from "./controllers/accounts.controller";
import AuthMiddleware from "./middlewares/auth.middleware";
import {User} from "@prisma/client";

declare module 'express-serve-static-core' {
  interface Request {
    user: User
  }
}

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(AuthMiddleware)
app.use('/users', UsersController)
app.use('/accounts', AccountsController)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://0.0.0.0:${port}`);
});
