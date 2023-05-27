import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from '../utilities/authentication';
import Note from '../models/note';
import Raise from '../models/raise';
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

  let raise = await Raise.findOne({_id: raise_id});

  if (!raise) {
    return res.status(400).json({'msg': 'Raise id not found.'});
    return;
  }

  const entries =await  Note.find({raise_id}); 
    
  return res.json(entries);
});

router.post('/save',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
    const raise_id = req.body.raise_id;
    const title = req.body.title;
    const description = req.body.description;

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

    if (!title) {
      return res.status(400).json({'msg': 'Title is required'});
      return;
    }

    if (!description) {
      return res.status(400).json({'msg': 'Description is required'});
      return;
    }

    const payload = {
      title : title,
      description: description,
      raise_id : raise_id,
    };

    let entry = new Note(payload); 
    
    await entry.save();

    return res.json(entry);
});

router.post('/update',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {


  const title = req.body.title;
  const description = req.body.description;
  console.log(req.body);

  if (!title) {
    return res.status(400).json({'msg': 'Title is required.'});
    return;
  }

  if (!description) {
    return res.status(400).json({'msg': 'Description is required.'});
    return;
  }

  const note_id = req.body.id;

  if (!Types.ObjectId.isValid(note_id)) {
    return res.status(400).json({'msg': 'Invalid note id.'});
    return;
  }  

  let note = await Note.findOne({_id: note_id});

  if (!note) {
    return res.status(400).json({'msg': 'Note id not found.'});
    return;
  }

  const filter = { _id  : note_id};
   
  const update = {
    title: title,
    description: description,
  };

  const entry = await Note.findOneAndUpdate(filter, update, {
    returnOriginal: false
  }); 
  
  return res.json(entry);
});

router.post('/delete',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const note_id = req.body.id;

  if (!Types.ObjectId.isValid(note_id)) {
    return res.status(400).json({'msg': 'Invalid note id.'});
    return;
  }  

  let note = await Note.findOne({_id: note_id});

  if (!note) {
    return res.status(400).json({'msg': 'Note id not found.'});
    return;
  }
   
  const deleted =await Note.deleteOne({_id: note_id});

  return res.json(deleted);
});


export const NoteRoutes: Router = router;