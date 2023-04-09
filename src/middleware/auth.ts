import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRequest, UserJwtPayload } from '../utilities/app';

const auth = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({ msg: "No auth token, access denied" });

    const verified : string | jwt.JwtPayload | UserJwtPayload = jwt.verify(token, "passwordKey");
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });

    req.user = verified;
    req.token = token;
    next();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = auth;