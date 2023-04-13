import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import User from './../models/users'

export interface UserRequest extends Request {
  user: User 
  token: string
}

export interface UserJwtPayload extends jwt.JwtPayload {
  id: string 
}


export type EntryType = "income" | "expenses";