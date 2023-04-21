import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from './../models/users'

export interface UserRequest extends Request {
  user: User 
  token: string
}

export interface UserJwtPayload extends jwt.JwtPayload {
  id: string 
}


import { Request } from "express"
export interface IGetUserAuthInfoRequest extends Request {
  user: IUser
}

export type EntryType = "income" | "expenses";