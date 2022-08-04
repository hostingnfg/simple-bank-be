import express from "express";
import jwt from "jsonwebtoken";
import UsersService from "../services/users.service";
import UsersRepository from "../repositories/users.repository";
import {User} from "@prisma/client";

const AuthMiddleware = express.Router()

const publicRoutes = ['/users/login', '/users'];

// @ts-ignore
AuthMiddleware.use((req, res, next) => {
  if (publicRoutes.includes(req.path)) {
    next();
  } else {
    const token = req.headers.authorization;
    if(!token) {
      res.status(401).json({
        error: 'Unauthorized'
      })
    } else {
      jwt.verify(token, process.env.JWT_SECRET ?? '', (err, user: any) => {
        if (err) {
          res.status(401).json({
            error: 'Unauthorized'
          })
        } else {
          const result = UsersService.generateJWT(user);
          UsersRepository.findUnique({
            where: {
              id: user.id
            }
          })
            .then((user: User) => {
              req.user = user;
              res.header('authorization', result.token)
              next();
            })
            .catch(() => res.status(500).json({ errors: [] }))
        }
      })
    }
  }
});

export default AuthMiddleware;