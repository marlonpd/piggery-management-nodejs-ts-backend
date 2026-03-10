import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from '../utilities/authentication';
import FeedInventory from '../models/feed_inventory';
import { Types } from 'mongoose';

const router: Router = Router();

router.get('', authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = req.user?.id;
    const entries = await FeedInventory.find({ user_id }).sort({ created_at: -1 });
    return res.json(entries);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.post('/save', authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = req.user?.id;
    const item_name = req.body.item_name;
    const unit = req.body.unit;
    const quantity = Number(req.body.quantity);
    const reorder_level = Number(req.body.reorder_level ?? 0);
    const cost_per_unit = Number(req.body.cost_per_unit ?? 0);

    if (!item_name) return res.status(400).json({ msg: 'Item name is required.' });
    if (!unit) return res.status(400).json({ msg: 'Unit is required.' });
    if (isNaN(quantity) || quantity < 0) return res.status(400).json({ msg: 'Quantity is invalid.' });
    if (isNaN(reorder_level) || reorder_level < 0) return res.status(400).json({ msg: 'Reorder level is invalid.' });
    if (isNaN(cost_per_unit) || cost_per_unit < 0) return res.status(400).json({ msg: 'Cost per unit is invalid.' });

    const entry = new FeedInventory({
      user_id,
      item_name,
      unit,
      quantity,
      reorder_level,
      cost_per_unit,
      supplier: req.body.supplier,
      notes: req.body.notes,
    });

    await entry.save();
    return res.json(entry);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.post('/update', authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.body.id;
    const user_id = req.user?.id;

    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid inventory id.' });
    }

    const update = {
      item_name: req.body.item_name,
      unit: req.body.unit,
      quantity: Number(req.body.quantity),
      reorder_level: Number(req.body.reorder_level ?? 0),
      cost_per_unit: Number(req.body.cost_per_unit ?? 0),
      supplier: req.body.supplier,
      notes: req.body.notes,
    };

    if (!update.item_name) return res.status(400).json({ msg: 'Item name is required.' });
    if (!update.unit) return res.status(400).json({ msg: 'Unit is required.' });
    if (isNaN(update.quantity) || update.quantity < 0) return res.status(400).json({ msg: 'Quantity is invalid.' });

    const entry = await FeedInventory.findOneAndUpdate({ _id: id, user_id }, update, {
      returnOriginal: false,
    });

    if (!entry) return res.status(404).json({ msg: 'Inventory item not found.' });

    return res.json(entry);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.post('/delete', authenticateToken, async function (req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.body.id;
    const user_id = req.user?.id;

    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid inventory id.' });
    }

    const entry = await FeedInventory.findOne({ _id: id, user_id });
    if (!entry) return res.status(404).json({ msg: 'Inventory item not found.' });

    const deleted = await FeedInventory.deleteOne({ _id: id, user_id });
    return res.json(deleted);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export const FeedInventoryRoutes: Router = router;
