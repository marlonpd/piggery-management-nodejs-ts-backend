
import { Request, Response, Router } from 'express';
import { authenticateToken, authentication } from '../utilities/authentication';
import Raise, { IRaise } from '../models/raise';
import { request } from 'http';

import { IGetUserAuthInfoRequest } from '../utilities/app';

const router: Router = Router();

router.post('/', authentication.required, function (req: Request, res: Response, next) {

    let payload = {
      raise_type : req.body.raise_type,
      name : req.body.name,
      user : req.payload.id,
    };

    let new_raise = new Raise(payload); 


});