import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from '../utilities/authentication';
import Livestock from '../models/livestock';

const router: Router = Router();

router.get('',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const raise_id =  req.params.raise_id;

  const livestocks =await  Livestock.find({raise_id}); 
    
  res.json(livestocks);
});

router.post('/save',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

    const payload = {
      name : req.body.name,
      riase_id : req.body?.raise_id,
    };

    let raise = new Livestock(payload); 
    
    await raise.save();

    res.json(raise);
});

router.post('/update',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const filter = { _id  : req.body.id};
   
  const update = {
    name : req.body.name,
    birdate : req.body.birth_date,
    weight : req.body.weight,
  };

  const livestock = await Livestock.findOneAndUpdate(filter, update, {
    returnOriginal: false
  }); 
  
  res.json(livestock);
});

router.post('/delete',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const id =  req.body.id;
   
  await Livestock.deleteOne({_id: id});

  res.json('deleted');
});


export const LivestockRoutes: Router = router;