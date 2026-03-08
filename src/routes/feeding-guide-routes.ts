import { NextFunction, Request, Response, Router } from "express";
import { authenticateToken } from "../utilities/authentication";
import Raise from "../models/raise";
import { Types } from "mongoose";
import FeedingGuideHandler from '../handlers/feeding_guide_handler';
import FeedingGuide from '../models/feeding_guide';

const router: Router = Router();

router.get(
  "",
  authenticateToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const raise_id = req.query.raise_id?.toString() ?? "";

      if (!raise_id) {
        return res.status(400).json({ msg: "Raise id is required." });
      }

      if (!Types.ObjectId.isValid(raise_id)) {
        return res.status(400).json({ msg: "Invalid raise id." });
      }

      let raise = await Raise.findOne({ _id: raise_id });

      if (!raise) {
        return res.status(400).json({ msg: "Raise id not found." });
      }

      const entries = await FeedingGuide.find({ raise_id });

      return res.json(entries);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
);

router.post(
  "/save",
  authenticateToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {

      const feedingGuideHandler = new FeedingGuideHandler();
      
      const validator = feedingGuideHandler.validateSaveRequest(req, res);

      if (! validator.validate()) {
          return res.status(400).json({ msg:  validator.errors().first()});
      }

      const payload = {
        raise_id: req.body.raise_id,
        from_date: req.body.from_date,
        to_date:  req.body.to_date,
        feeding_period: req.body.feeding_period,
        feed_type: req.body.feed_type,
        feed_name: req.body.feed_name,
        grams: req.body.grams,
      };

      let entry = new FeedingGuide(payload);

      await entry.save();

      return res.json(entry);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
);

router.post(
  "/update",
  authenticateToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const feeding_guide_id = req.body.id;

      if (!feeding_guide_id) {
        return res.status(400).json({ msg: "Feeding guide id is required." });
        return;
      }

      if (!Types.ObjectId.isValid(feeding_guide_id)) {
        return res.status(400).json({ msg: "Invalid feeding guide id." });
        return;
      }

      const filter = { _id: feeding_guide_id };

      const feedingGuideHandler = new FeedingGuideHandler();
      const validator = feedingGuideHandler.validateSaveRequest(req, res);

      if (!validator.validate()) {
        return res.status(400).json({ msg: validator.errors().first() });
      }

      const update = {
        raise_id: req.body.raise_id,
        from_date: req.body.from_date,
        to_date: req.body.to_date,
        feeding_period: req.body.feeding_period,
        feed_type: req.body.feed_type,
        feed_name: req.body.feed_name,
        grams: req.body.grams,
      };

      const entry = await FeedingGuide.findOneAndUpdate(filter, update, {
        returnOriginal: false,
      });

      return res.json(entry);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
);

router.post(
  "/delete",
  authenticateToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const feeding_guide_id = req.body.id;

      if (!feeding_guide_id) {
        return res.status(400).json({ msg: "Feeding guide id is required." });
        return;
      }

      if (!Types.ObjectId.isValid(feeding_guide_id)) {
        return res.status(400).json({ msg: "Invalid feeding guide id." });
        return;
      }

      let feedingGuide = await FeedingGuide.findOne({ _id: feeding_guide_id });

      if (!feedingGuide) {
        return res.status(400).json({ msg: "Feeding guide id not found." });
      }

      const deleted = await FeedingGuide.deleteOne({ _id: feeding_guide_id });

      return res.json(deleted);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
);

router.get(
  "/summary",
  authenticateToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const raise_id = req.query.raise_id?.toString() ?? "";

      if (!raise_id) {
        return res.status(400).json({ msg: "Raise id is required." });
        return;
      }

      if (!Types.ObjectId.isValid(raise_id)) {
        return res.status(400).json({ msg: "Invalid raise id." });
        return;
      }

      const summaries = await FeedingGuide.aggregate([
        {
          $match: {
            raise_id: new Types.ObjectId(raise_id),
          },
        },
        {
          $group: {
            _id: null,
            total_grams: { $sum: '$grams' },
            entry_count: { $sum: 1 },
          },
        },
      ]);

      const payload = summaries[0] || { total_grams: 0, entry_count: 0 };

      return res.json(payload);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
);

export const FeedingGuideRoutes: Router = router;
