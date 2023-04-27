import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from '../utilities/authentication';
import Event from '../models/event';

const router: Router = Router();

router.get('',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const raise_id =  req.params.raise_id;

  const entries =await  Event.find({raise_id}); 
    
  res.json(entries);
});

router.post('/save',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

    const payload = {
      name : req.body.name,
      riase_id : req.body?.raise_id,
    };

    let entry = new Event(payload); 
    
    await entry.save();

    res.json(entry);
});

router.post('/update',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const filter = { _id  : req.body.id};
   
  const update = {
    name : req.body.name,
    birdate : req.body.birth_date,
    weight : req.body.weight,
  };

  const entry = await Event.findOneAndUpdate(filter, update, {
    returnOriginal: false
  }); 
  
  res.json(entry);
});

router.post('/delete',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const id =  req.body.id;
   
  await Event.deleteOne({_id: id});

  res.json('deleted');
});


export const EventRoutes: Router = router;