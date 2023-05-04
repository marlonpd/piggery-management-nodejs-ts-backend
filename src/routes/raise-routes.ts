
import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from '../utilities/authentication';
import Raise from '../models/raise';
import Livestock from '../models/livestock';
import { conn } from '../utilities/connection';
import { ERaiseType } from '../utilities/constants';
const router: Router = Router();


router.get('',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const user_id =  req.user?.id;

  const raises =await  Raise.find({user: user_id}); 
    
  res.json(raises);
});

router.post('/save',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

    const session = await conn.startSession();
    
    try {
        session.startTransaction();

        const _id =  req.user?.id;
        const raise_type = req.body.raise_type;
        const raise_name = req.body.name;
        const head_count = Number(req.body.head_count);

        if (!raise_type) {
          res.status(400).json({'msg' : 'Raise type is required'});
          return;
        }
      

        if (!head_count) {
          res.status(400).json({'msg':'Head count is required'});
          return;
        }
      
        if (!raise_name) {
          res.status(400).json({'msg':'Name is required'});
          return;
        }
         
        const payload = {
          raise_type : raise_type,
          name : raise_name,
          head_count: head_count,
          user : _id,
        };

        let raise = new Raise(payload); 
        await raise.save();

        if (raise_type === ERaiseType.fattener || raise_type === ERaiseType.weaner) {
          for (let i = 0; i < head_count; i++ ) {
            const lss = new Livestock({
              name : raise_type + `(${i})`,
              raise_id : raise._id,
              weight : null,
              birth_date : null,
            });
            await lss.save();
          }
        } else {
          const lss = new Livestock({
            name : raise_type + `(1)`,
            raise_id : raise._id,
            weight : null,
            birth_date : null,
          });
          await lss.save();
        }

        await session.commitTransaction();

        res.json(raise);

    } catch (e :any) {

      console.log(e);
      await session.abortTransaction();
    }
    
});

router.post('/update',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const name = req.body.name;
  const raise_id = req.body.id;
  const hog_pen = req.body.hog_pen;
  const head_count = Number(req.body.head_count);

  const filter = { _id  : raise_id};

  if (!raise_id) {
    res.status(400).json({'msg':'Raise id is required'});
    return;
  }

  if (!head_count) {
    res.status(400).json({'msg':'Head count is required'});
    return;
  }

  if (!name) {
    res.status(400).json({'msg':'Name is required'});
    return;
  }

  const update = {
    name,
    head_count,
    hog_pen,
  };

  const raise = await Raise.findOneAndUpdate(filter, update, {
    returnOriginal: false
  }); 
  
  res.json(raise);
});

router.post('/delete',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const raise_id =  req.body.id;

  if (!raise_id) {
    res.status(400).json({'msg':'Raise id is required.'});
    return;
  }

  let raise = await Raise.findOne({_id: raise_id});

  if (!raise) {
    res.status(400).json({'msg':'Raise id not found.'});
    return;
  }

  let deleted = await Raise.deleteOne({_id: raise_id});

  res.json(deleted);
});

export const RaiseRoutes: Router = router;