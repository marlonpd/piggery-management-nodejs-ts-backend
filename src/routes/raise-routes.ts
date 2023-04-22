
import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from '../utilities/authentication';
import Raise, { IRaise } from '../models/raise';
import { request } from 'http';
import User from '../models/users';

import { IGetUserAuthInfoRequest } from '../utilities/app';

const router: Router = Router();

router.post('/save',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

    const _id =  req.user?.id;

    const existingUser = await User.findOne({ _id });
 
    let payload = {
      raise_type : req.body.raise_type,
      name : req.body.name,
      user : existingUser,
    };

    let new_raise = new Raise(payload); 
    
    new_raise.save();

    res.json(new_raise);
});

export const RaiseRoutes: Router = router;