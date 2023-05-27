import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from '../utilities/authentication';
import Livestock, { ILivestock } from '../models/livestock';
import { Types } from 'mongoose';

const router: Router = Router();

router.get('',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const raise_id =  req.query.raise_id?.toString();

  if (!raise_id) {
    return res.status(400).json({'msg': 'Raise id is required.'});
    return;
  }

  if (!Types.ObjectId.isValid(raise_id)) {
    return res.status(400).json({'msg': 'Invalid raise id.'});
    return;
  }

  const livestocks = await  Livestock.find({raise_id}); 
    
  return res.json(livestocks);
});

router.post('/save',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
    const raise_id = req.body.raise_id;
    const name = req.body.name;

    if (!raise_id) {
      return res.status(400).json({'msg': 'Raise id is required'});
      return;
    }

    if (!name) {
      return res.status(400).json({'msg': 'Livestock name is required'});
      return;
    }

    const payload = {
      name : name,
      raise_id : raise_id,
      weight : req.body?.weight,
      birth_date : req.body?.weight,
    };

    let raise = new Livestock(payload); 
    
    await raise.save();

    return res.json(raise);
});

router.post('/update',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

    const name = req.body.name;
    const livestock_id = req.body.livestock_id;

    if (!livestock_id) {
      return res.status(400).json({'msg': 'Livestock id is required'});
      return;
    }

    if (!name) {
      return res.status(400).json({'msg': 'Livestock name is required'});
      return;
    }

    const filter = { _id  : livestock_id};
    
    const update = {
      name : name,
      birdate : req.body.birth_date,
      weight : req.body.weight,
    };

    const livestock = await Livestock.findOneAndUpdate(filter, update, {
      returnOriginal: false
    }); 
    
    return res.json(livestock);
});

router.post('/delete',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const livestock_id = req.body.livestock_id;

  if (!livestock_id) {
    return res.status(400).json({'msg': 'Livestock id is required'});
  }

  let livestock = await Livestock.findOne({_id: livestock_id});

  if (!livestock) {
    return res.status(400).json({'msg': 'Livestock id not found.'});
  }

  let deleted = await Livestock.deleteOne({_id: livestock_id});

  return res.json(deleted);
});


export const LivestockRoutes: Router = router;