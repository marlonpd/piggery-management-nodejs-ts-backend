
import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from '../utilities/authentication';
import Raise from '../models/raise';

const router: Router = Router();


router.get('',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const user_id =  req.user?.id;

  const raises =await  Raise.find({user: user_id}); 
    
  res.json(raises);
});

router.post('/save',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

    const _id =  req.user?.id;

    const payload = {
      raise_type : req.body.raise_type,
      name : req.body.name,
      user : _id,
    };

    let raise = new Raise(payload); 
    
    await raise.save();

    res.json(raise);
});

router.post('/update',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const filter = { _id  : req.body.id};
   
  const update = {
    raise_type : req.body.raise_type,
    name : req.body.name
  };

  const raise = await Raise.findOneAndUpdate(filter, update, {
    returnOriginal: false
  }); 
  
  res.json(raise);
});

router.post('/delete',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const id =  req.body.id;
   
  await Raise.deleteOne({_id: id});

  res.json('deleted');
});

export const RaiseRoutes: Router = router;