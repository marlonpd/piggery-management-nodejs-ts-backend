
import { Request, NextFunction, Response } from 'express';
const jwt =  require('express-jwt');
import { JWT_SECRET } from "./secrets";
import { IUser } from '../models/users';
import { IGetUserAuthInfoRequest } from './app';


function getTokenFromHeader(req: Request): string | null {

  const headerAuth: string | string[] = req.headers.authorization ?? '';

  if (headerAuth !== undefined && headerAuth !== null) {

    if (Array.isArray(headerAuth)) {
      return splitToken(headerAuth[0]);
    } else {
      return splitToken(headerAuth);
    }

  } else {

    return null;
  }
}


function splitToken(authString: string) {

  if (authString.split(' ')[0] === 'Token') {
    return authString.split(' ')[1];

  } else {
    return null;
  }
}

export const verifyJwt = async (req: Request) => {authentication
  // no token provided
  if (!req.headers.authorization) return null

  // from "Token x123445xabcd" to "x123445xabcd"
  const token = req.headers.authorization.split(' ').pop()

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (err) {
    console.error('Token Verification Failed')
    return null
  }
}

export const authenticateToken = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: IUser) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

const auth = {
  required: jwt({
    credentialsRequired: true,
    secret             : JWT_SECRET,
    getToken           : getTokenFromHeader,
    userProperty       : 'payload',
    // @ts-ignore
    algorithms         : ['HS256']
  }),

  optional: jwt({
    credentialsRequired: false,
    secret             : JWT_SECRET,
    getToken           : getTokenFromHeader,
    userProperty       : 'payload',
    algorithms         : ['HS256']
  })
};

export const authentication = auth;