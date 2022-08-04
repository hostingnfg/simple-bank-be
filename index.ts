import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import bodyParser from 'body-parser';
import UsersController from "./controllers/users.controller";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(bodyParser.json());

app.use('/users', UsersController)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://0.0.0.0:${port}`);
});
