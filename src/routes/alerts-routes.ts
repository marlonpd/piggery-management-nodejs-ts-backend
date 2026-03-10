import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from '../utilities/authentication';
import Raise from '../models/raise';
import Event from '../models/event';
import Reminder from '../models/reminder';
import FeedInventory from '../models/feed_inventory';

const router: Router = Router();

router.get('', authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = req.user?.id;

    const raises = await Raise.find({ user: user_id }, { _id: 1 });
    const raiseIds = raises.map((raise) => raise._id);

    const now = new Date();
    const next7days = new Date();
    next7days.setDate(next7days.getDate() + 7);

    const lowStocks = await FeedInventory.find({
      user_id,
      $expr: { $lte: ['$quantity', '$reorder_level'] },
    }).sort({ quantity: 1 });

    const dueReminders = await Reminder.find({
      user_id,
      status: 'pending',
      due_date: { $gte: now, $lte: next7days },
    }).sort({ due_date: 1 });

    const upcomingEvents = raiseIds.length > 0
      ? await Event.find({ raise_id: { $in: raiseIds }, event_date: { $gte: now, $lte: next7days } }).sort({ event_date: 1 })
      : [];

    const alerts = [
      ...lowStocks.map((item) => ({
        type: 'low_stock',
        severity: 'high',
        title: 'Low Feed Stock',
        message: `${item.item_name} is below reorder level (${item.quantity} ${item.unit}).`,
        reference_id: item._id,
      })),
      ...dueReminders.map((item) => ({
        type: 'reminder_due',
        severity: 'medium',
        title: item.title,
        message: `Reminder due on ${new Date(item.due_date).toLocaleDateString()}.`,
        reference_id: item._id,
      })),
      ...upcomingEvents.map((item) => ({
        type: 'upcoming_event',
        severity: 'low',
        title: item.title,
        message: `Event on ${new Date(item.event_date).toLocaleDateString()}.`,
        reference_id: item._id,
      })),
    ];

    return res.json(alerts);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export const AlertsRoutes: Router = router;
