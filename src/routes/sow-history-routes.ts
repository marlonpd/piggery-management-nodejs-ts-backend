import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from '../utilities/authentication';
import Raise from '../models/raise';
import SowHistory from '../models/sow_history';
import { Types } from 'mongoose';

const router: Router = Router();

router.get('',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const raise_id =  req.query.raise_id?.toString();

  if (!raise_id) {
    return res.status(400).json({'msg': 'Raise id is required.'});
  }

  if (!Types.ObjectId.isValid(raise_id)) {
    return res.status(400).json({'msg': 'Invalid raise id.'});
  }

  let raise = await Raise.findOne({_id: raise_id});

  if (!raise) {
    return res.status(400).json({'msg': 'Raise id not found.'});
  }

  const history =await  SowHistory.find({raise_id}); 
    
  return res.json(history);
});

router.post('/save',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
    const raise_id = req.body.raise_id;
    const boar_name = req.body.boar_name;
    const boar_breed = req.body.boar_breed;
    const boar_owner = req.body.boar_owner;
    const boar_no = req.body.boar_no;
    const breed_date = req.body.breed_date;
    const estimated_farrowed_date = req.body.estimated_farrowed_date;
    const actual_farrowed_date = req.body.actual_farrowed_date;
    const litter_male_count = req.body.litter_male_count;
    const litter_female_count = req.body.litter_female_count;
    const litter_deceased_count = req.body.litter_deceased_count;
    const weaened_litter_male_count = req.body.weaened_litter_male_count;
    const weaened_litter_female_count = req.body.weaened_litter_female_count;
    const weaened_litter_deceased_count = req.body.weaened_litter_deceased_count;
    const remarks = req.body.remarks;


    if (!raise_id) {
      return res.status(400).json({'msg': 'Raise id is required'});
      return;
    }

    if (!Types.ObjectId.isValid(raise_id)) {
      return res.status(400).json({'msg': 'Invalid raise id.'});
      return;
    }  

    let raise = await Raise.findOne({_id: raise_id});

    if (!raise) {
      return res.status(400).json({'msg': 'Raise id not found.'});
      return;
    }

    if (!boar_name) {
      return res.status(400).json({'msg': 'Boar name is required'});
    }

    if (!boar_breed) {
      return res.status(400).json({'msg': 'Boar breed is required'});
    }

    if (!breed_date) {
      return res.status(400).json({'msg': 'Breed date is required'});
    }

    const payload = {
      raise_id,
      boar_name,
      boar_breed,
      boar_owner,
      boar_no,
      breed_date,
      estimated_farrowed_date,
      actual_farrowed_date,
      litter_male_count,
      litter_female_count,
      litter_deceased_count,
      weaened_litter_male_count,
      weaened_litter_female_count,
      weaened_litter_deceased_count,
      remarks, 
    };

    let entry = new SowHistory(payload); 
    
    await entry.save();

    return res.json(entry);
});

router.post('/update',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {


  const sow_history_id = req.body.sow_history_id;
  const raise_id = req.body.raise_id;
  const boar_name = req.body.boar_name;
  const boar_breed = req.body.boar_breed;
  const boar_owner = req.body.boar_owner;
  const boar_no = req.body.boar_no;
  const breed_date = req.body.breed_date;
  const estimated_farrowed_date = req.body.estimated_farrowed_date;
  const actual_farrowed_date = req.body.actual_farrowed_date;
  const litter_male_count = req.body.litter_male_count;
  const litter_female_count = req.body.litter_female_count;
  const litter_deceased_count = req.body.litter_deceased_count;
  const weaened_litter_male_count = req.body.weaened_litter_male_count;
  const weaened_litter_female_count = req.body.weaened_litter_female_count;
  const weaened_litter_deceased_count = req.body.weaened_litter_deceased_count;
  const remarks = req.body.remarks;


  if (!raise_id) {
    return res.status(400).json({'msg': 'Raise id is required'});
    return;
  }

  if (!Types.ObjectId.isValid(raise_id)) {
    return res.status(400).json({'msg': 'Invalid raise id.'});
    return;
  }  

  let raise = await Raise.findOne({_id: raise_id});

  if (!raise) {
    return res.status(400).json({'msg': 'Raise id not found.'});
    return;
  }

  if (!boar_name) {
    return res.status(400).json({'msg': 'Boar name is required'});
  }

  if (!boar_breed) {
    return res.status(400).json({'msg': 'Boar breed is required'});
  }

  if (!breed_date) {
    return res.status(400).json({'msg': 'Breed date is required'});
  }

  const filter = { _id  : sow_history_id};
   
  const update = {
    raise_id,
    boar_name,
    boar_breed,
    boar_owner,
    boar_no,
    breed_date,
    estimated_farrowed_date,
    actual_farrowed_date,
    litter_male_count,
    litter_female_count,
    litter_deceased_count,
    weaened_litter_male_count,
    weaened_litter_female_count,
    weaened_litter_deceased_count,
    remarks, 
  };

  const entry = await SowHistory.findOneAndUpdate(filter, update, {
    returnOriginal: false
  }); 
  
  return res.json(entry);
});

router.post('/delete',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const sow_history_id = req.body.id;

  if (!Types.ObjectId.isValid(sow_history_id)) {
    return res.status(400).json({'msg': 'Invalid sow history id.'});
  }  

  let show_history = await SowHistory.findOne({_id: sow_history_id});

  if (!show_history) {
    return res.status(400).json({'msg': 'Show history id not found.'});
  }
   
  const deleted = await SowHistory.deleteOne({_id: show_history});

  return res.json(deleted);
});


export const SowHistoryRoutes: Router = router;