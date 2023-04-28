import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from '../utilities/authentication';
import Event from '../models/event';
import Raise from '../models/raise';
import { Types } from 'mongoose';

const router: Router = Router();

router.get('',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const raise_id =  req.query.raise_id?.toString();

  if (!raise_id) {
    res.status(400).json('Raise id is required.');
    return;
  }

  if (!Types.ObjectId.isValid(raise_id)) {
    res.status(400).json('Invalid raise id.');
    return;
  }

  let raise = await Raise.findOne({_id: raise_id});

  if (!raise) {
    res.status(400).json('Raise id not found.');
    return;
  }

  const vents =await  Event.find({raise_id}); 
    
  res.json(vents);
});

router.post('/save',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
    const raise_id = req.body.raise_id;
    const title = req.body.title;
    const event_date = req.body.event_date;

    if (!raise_id) {
      res.status(400).json('Raise id is required');
      return;
    }

    if (!Types.ObjectId.isValid(raise_id)) {
      res.status(400).json('Invalid raise id.');
      return;
    }  

    let raise = await Raise.findOne({_id: raise_id});

    if (!raise) {
      res.status(400).json('Raise id not found.');
      return;
    }

    if (!title) {
      res.status(400).json('Title is required');
      return;
    }

    if (!event_date) {
      res.status(400).json('Event date is required');
      return;
    }

    const payload = {
      title : title,
      event_date: new Date(event_date),
      riase_id : raise_id,
    };

    let entry = new Event(payload); 
    
    await entry.save();

    res.json(entry);
});

router.post('/update',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {


  const title = req.body.title;
  const event_date = req.body.event_date;

  if (!title) {
    res.status(400).json('Title is required');
    return;
  }

  if (!event_date) {
    res.status(400).json('Event date is required');
    return;
  }

  const event_id = req.body.node_id;

  if (!Types.ObjectId.isValid(event_id)) {
    res.status(400).json('Invalid Event id.');
    return;
  }  

  let event = await Event.findOne({_id: event_id});

  if (!event) {
    res.status(400).json('Event id not found.');
    return;
  }

  const filter = { _id  : event_id};
   
  const update = {
    title: title,
    event_date: new Date(event_date),
  };

  const entry = await Event.findOneAndUpdate(filter, update, {
    returnOriginal: false
  }); 
  
  res.json(entry);
});

router.post('/delete',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const event_id = req.body.node_id;

  if (!Types.ObjectId.isValid(event_id)) {
    res.status(400).json('Invalid event id.');
    return;
  }  

  let event = await Event.findOne({_id: event_id});

  if (!event) {
    res.status(400).json('Event id not found.');
    return;
  }
   
  const deleted = await Event.deleteOne({_id: event_id});

  res.json(deleted);
});


export const EventRoutes: Router = router;