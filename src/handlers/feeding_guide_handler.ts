import { NextFunction, Request, Response, Router } from 'express';
import { make } from 'simple-body-validator';
import { Types } from 'mongoose';
import Raise from "../models/raise";

class FeedingGuideHandler {
  public validateSaveRequest(req: Request, res: Response) {

      const data = req.body;

      const rules = {
          raise_id: ['required'],
          feeding_period: ['required'],
          feed_type: ['required'],
          feed_name: ['required'],
          grams: ['required'],
      };

      const validator = make().setData(data).setRules(rules);

      return validator;
  }
}


export default FeedingGuideHandler;