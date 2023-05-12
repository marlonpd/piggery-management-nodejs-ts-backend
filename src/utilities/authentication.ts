
import { Request, NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

export const  getTokenFromHeader = (req: Request): string => {

  const authHeader: string = req.headers['authorization']?.toString() ?? ''
  const token = authHeader && authHeader?.split(' ')[1]

  return token;
}


function splitToken(authString: string) {

  if (authString.split(' ')[0] === 'Token') {
    return authString.split(' ')[1];

  } else {
    return null;
  }
}

// export const verifyJwt = async (req: Request) => {authentication
//   // no token provided
//   if (!req.headers.authorization) return null

//   // from "Token x123445xabcd" to "x123445xabcd"
//   const token = req.headers.authorization.split(' ').pop() ?? ''

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET)
//     return decoded
//   } catch (err) {
//     console.error('Token Verification Failed')
//     return null
//   }
// }

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader: string = req.headers['authorization']?.toString() ?? ''
  const token = authHeader && authHeader?.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  const secret = process.env.JWT_SECRET ?? '';

  jwt.verify(token, secret , (err: any, user: any) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    user.token = token;
    req.user = user
    next()
  })
}

// const auth = {
//   required: jwt({
//     credentialsRequired: true,
//     secret             : JWT_SECRET,
//     getToken           : getTokenFromHeader,
//     userProperty       : 'payload',
//     // @ts-ignore
//     algorithms         : ['HS256']
//   }),

//   optional: jwt({
//     credentialsRequired: false,
//     secret             : JWT_SECRET,
//     getToken           : getTokenFromHeader,
//     userProperty       : 'payload',
//     algorithms         : ['HS256']
//   })
// };

// export const authentication = auth;