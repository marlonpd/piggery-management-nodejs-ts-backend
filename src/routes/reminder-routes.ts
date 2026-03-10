import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from '../utilities/authentication';
import Reminder from '../models/reminder';
import { Types } from 'mongoose';

const router: Router = Router();

router.get('', authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = req.user?.id;
    const status = req.query.status?.toString();

    const filter: any = { user_id };
    if (status) filter.status = status;

    const reminders = await Reminder.find(filter).sort({ due_date: 1 });
    return res.json(reminders);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.post('/save', authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = req.user?.id;
    const title = req.body.title;
    const due_date = req.body.due_date;

    if (!title) return res.status(400).json({ msg: 'Title is required.' });
    if (!due_date) return res.status(400).json({ msg: 'Due date is required.' });

    const reminder = new Reminder({
      user_id,
      title,
      description: req.body.description,
      category: req.body.category || 'general',
      due_date,
      status: req.body.status || 'pending',
    });

    await reminder.save();
    return res.json(reminder);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.post('/update', authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = req.user?.id;
    const id = req.body.id;

    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid reminder id.' });
    }

    const update = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || 'general',
      due_date: req.body.due_date,
      status: req.body.status || 'pending',
    };

    if (!update.title) return res.status(400).json({ msg: 'Title is required.' });
    if (!update.due_date) return res.status(400).json({ msg: 'Due date is required.' });

    const reminder = await Reminder.findOneAndUpdate({ _id: id, user_id }, update, {
      returnOriginal: false,
    });

    if (!reminder) return res.status(404).json({ msg: 'Reminder not found.' });

    return res.json(reminder);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.post('/mark-done', authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = req.user?.id;
    const id = req.body.id;

    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid reminder id.' });
    }

    const reminder = await Reminder.findOneAndUpdate(
      { _id: id, user_id },
      { status: 'done' },
      { returnOriginal: false },
    );

    if (!reminder) return res.status(404).json({ msg: 'Reminder not found.' });

    return res.json(reminder);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.post('/delete', authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = req.user?.id;
    const id = req.body.id;

    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid reminder id.' });
    }

    const reminder = await Reminder.findOne({ _id: id, user_id });
    if (!reminder) return res.status(404).json({ msg: 'Reminder not found.' });

    const deleted = await Reminder.deleteOne({ _id: id, user_id });
    return res.json(deleted);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export const ReminderRoutes: Router = router;
