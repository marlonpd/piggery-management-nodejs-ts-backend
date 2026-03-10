import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from '../utilities/authentication';
import { authorizeRoles } from '../middleware/authorization';
import Raise from '../models/raise';
import Accounting from '../models/accounting';
import FeedInventory from '../models/feed_inventory';

const router: Router = Router();

function escapeCsv(value: any) {
  const text = `${value ?? ''}`.replace(/"/g, '""');
  return `"${text}"`;
}

router.get('/accounting.csv', authenticateToken, authorizeRoles('owner', 'manager'), async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = req.user?.id;
    const raises = await Raise.find({ user: user_id }, { _id: 1 });
    const raiseIds = raises.map((raise) => raise._id);

    const entries = raiseIds.length > 0 ? await Accounting.find({ raise_id: { $in: raiseIds } }).sort({ created_at: -1 }) : [];

    const header = ['date', 'raise_id', 'description', 'entry_type', 'amount'];
    const rows = entries.map((entry: any) => [
      new Date(entry.created_at || entry.updated_at || Date.now()).toISOString(),
      entry.raise_id,
      entry.description,
      entry.entry_type,
      Number(entry.amount || 0),
    ]);

    const csv = [header, ...rows].map((row) => row.map((cell) => escapeCsv(cell)).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="accounting-report.csv"');
    return res.status(200).send(csv);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.get('/feed-inventory.csv', authenticateToken, authorizeRoles('owner', 'manager'), async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = req.user?.id;
    const entries = await FeedInventory.find({ user_id }).sort({ created_at: -1 });

    const header = ['date', 'item_name', 'unit', 'quantity', 'reorder_level', 'cost_per_unit', 'supplier', 'notes'];
    const rows = entries.map((entry: any) => [
      new Date(entry.created_at || entry.updated_at || Date.now()).toISOString(),
      entry.item_name,
      entry.unit,
      Number(entry.quantity || 0),
      Number(entry.reorder_level || 0),
      Number(entry.cost_per_unit || 0),
      entry.supplier,
      entry.notes,
    ]);

    const csv = [header, ...rows].map((row) => row.map((cell) => escapeCsv(cell)).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="feed-inventory-report.csv"');
    return res.status(200).send(csv);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export const ReportRoutes: Router = router;
