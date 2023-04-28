import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user'

export interface UserRequest extends Request {
  user: User 
  token: string
}

export interface UserJwtPayload extends jwt.JwtPayload {
  id: string 
}

export interface IGetUserAuthInfoRequest<ReqBody = { user: IUser; }> extends Request {};

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser
  }
  interface Response {
    user?: IUser
  }
}

export type TEntryType = "income" | "expenses";
export type TRaiseType = "weaner" | "boar" | "sow" | 'fattener';