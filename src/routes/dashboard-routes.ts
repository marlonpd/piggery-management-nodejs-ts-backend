import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from '../utilities/authentication';
import Raise from '../models/raise';
import Livestock from '../models/livestock';
import Accounting from '../models/accounting';
import Event from '../models/event';
import Reminder from '../models/reminder';
import FeedInventory from '../models/feed_inventory';

const router: Router = Router();

router.get('/summary', authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = req.user?.id;

    const raises = await Raise.find({ user: user_id }, { _id: 1 });
    const raiseIds = raises.map((raise) => raise._id);

    const raise_count = raiseIds.length;
    const livestock_count = raise_count > 0 ? await Livestock.countDocuments({ raise_id: { $in: raiseIds } }) : 0;

    const accountingEntries = raise_count > 0 ? await Accounting.find({ raise_id: { $in: raiseIds } }) : [];

    const total_expenses = accountingEntries
      .filter((entry) => entry.entry_type === 'expenses')
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

    const total_sales = accountingEntries
      .filter((entry) => entry.entry_type === 'sales')
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

    const net_income = total_sales - total_expenses;

    const now = new Date();
    const next7days = new Date();
    next7days.setDate(next7days.getDate() + 7);

    const upcoming_events = raise_count > 0
      ? await Event.countDocuments({ raise_id: { $in: raiseIds }, event_date: { $gte: now, $lte: next7days } })
      : 0;

    const pending_reminders = await Reminder.countDocuments({
      user_id,
      status: 'pending',
      due_date: { $gte: now, $lte: next7days },
    });

    const low_stock_items = await FeedInventory.countDocuments({
      user_id,
      $expr: { $lte: ['$quantity', '$reorder_level'] },
    });

    return res.json({
      raise_count,
      livestock_count,
      total_expenses,
      total_sales,
      net_income,
      upcoming_events,
      pending_reminders,
      low_stock_items,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export const DashboardRoutes: Router = router;
