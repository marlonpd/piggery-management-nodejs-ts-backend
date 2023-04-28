import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from '../utilities/authentication';
import Accounting from '../models/accounting';
import Raise from '../models/raise';
import { EEntryType } from '../utilities/constants';
import {Types } from 'mongoose';

const router: Router = Router();

router.get('',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const raise_id =  req.query.raise_id?.toString() ?? '';

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

  const entries = await  Accounting.find({raise_id }); 
    
  res.json(entries);
});

router.post('/save',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

    const raise_id =  req.body.raise_id;

    if (!raise_id) {
      res.status(400).json('Raise id is required1.' );
      return;
    }

    if (!Types.ObjectId.isValid(raise_id)) {
      res.status(400).json('Invalid raise id.');
      return;
    }

    let raise = await Raise.findOne({_id: raise_id});

    if (!raise) {
      res.status(400).json('Raise id not found.');
    }

    const description =  req.body.description;

    if (!description) {
      res.status(400).json('Description id is required.');
      return;
    }

    const entry_type =  req.body.entry_type;

    if (!entry_type) {
      res.status(400).json('Entry type id is required.');
      return;
    }

    if (!(entry_type in EEntryType)) {
      res.status(400).json('Invalid entry type.');
      return;
    }

    const amount =  Number(req.body.amount);

    if (!amount) {
      res.status(400).json('Amount is required.');
      return;
    }

    if (isNaN(amount)) {
      res.status(400).json('Invalid amount.');
      return;
    }

    const payload = {
      raise_id: raise_id,
      description: description,
      entry_type: entry_type,
      amount: amount
    };

    let entry = new Accounting(payload); 
    
    await entry.save();

    res.json(entry);
});

router.post('/update',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
    const accounting_id =  req.body.accounting_id;

    if (!accounting_id) {
      res.status(400).json('Accounting id is required.');
      return;
    }

    if (!Types.ObjectId.isValid(accounting_id)) {
      res.status(400).json('Invalid accounting id.');
      return;
    }

    const filter = {_id: accounting_id};

    const description =  req.body.description;

    if (!description) {
      res.status(400).json('Description id is required.');
      return;
    }

    const entry_type =  req.body.entry_type;

    if (!entry_type) {
      res.status(400).json('Entry type id is required.');
      return;
    }

    if (!(entry_type in EEntryType)) {
      res.status(400).json('Invalid entry type.');
      return;
    }

    const amount =  Number(req.body.amount);

    if (!amount) {
      res.status(400).json('Amount is required.');
      return;
    }

    if (isNaN(amount)) {
      res.status(400).json('Invalid amount.');
      return;
    }

    const update = {
      description: description,
      entry_type: entry_type,
      amount: amount
    };

    const entry = await Accounting.findOneAndUpdate(filter, update, {
      returnOriginal: false
    }); 
    
    res.json(entry);
});

router.post('/delete',  authenticateToken, async function (req: Request, res: Response, next: NextFunction) {

  const accounting_id =  req.body.accounting_id;

  if (!accounting_id) {
    res.status(400).json('Accounting id is required.');
    return;
  }

  if (!Types.ObjectId.isValid(accounting_id)) {
    res.status(400).json('Invalid accounting id.');
    return;
  }

  let accounting = await Accounting.findOne({_id: accounting_id});

  if (!accounting) {
    res.status(400).json('Accounting id not found.');
  }
   
  const deleted = await Accounting.deleteOne({_id: accounting_id});

  res.json(deleted);
});


export const AccountingRoutes: Router = router;