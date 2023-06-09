import { NextFunction, Request, Response, Router } from "express";
import { authenticateToken } from "../utilities/authentication";
import Accounting from "../models/accounting";
import Raise from "../models/raise";
import { EEntryType } from "../utilities/constants";
import { Types } from "mongoose";

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

      const entries = await Accounting.find({ raise_id });

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
      const raise_id = req.body.raise_id;

      if (!raise_id) {
        return res.status(400).json({ msg: "Raise id is required." });
        return;
      }

      if (!Types.ObjectId.isValid(raise_id)) {
        return res.status(400).json({ msg: "Invalid raise id." });
        return;
      }

      let raise = await Raise.findOne({ _id: raise_id });

      if (!raise) {
        return res.status(400).json({ msg: "Raise id not found." });
      }

      const description = req.body.description;

      if (!description) {
        return res.status(400).json({ msg: "Description id is required." });
        return;
      }

      const entry_type = req.body.entry_type;

      if (!entry_type) {
        return res.status(400).json({ msg: "Entry type id is required." });
        return;
      }

      if (!(entry_type in EEntryType)) {
        return res.status(400).json({ msg: "Invalid entry type." });
        return;
      }

      const amount = Number(req.body.amount);

      if (!amount) {
        return res.status(400).json({ msg: "Amount is required." });
        return;
      }

      if (isNaN(amount)) {
        return res.status(400).json({ msg: "Invalid amount." });
        return;
      }

      const payload = {
        raise_id: raise_id,
        description: description,
        entry_type: entry_type,
        amount: amount,
      };

      let entry = new Accounting(payload);

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
      const accounting_id = req.body.id;

      if (!accounting_id) {
        return res.status(400).json({ msg: "Accounting id is required." });
        return;
      }

      if (!Types.ObjectId.isValid(accounting_id)) {
        return res.status(400).json({ msg: "Invalid accounting id." });
        return;
      }

      const filter = { _id: accounting_id };

      const description = req.body.description;

      if (!description) {
        return res.status(400).json({ msg: "Description id is required." });
        return;
      }

      const entry_type = req.body.entry_type;

      if (!entry_type) {
        return res.status(400).json({ msg: "Entry type id is required." });
        return;
      }

      if (!(entry_type in EEntryType)) {
        return res.status(400).json({ msg: "Invalid entry type." });
        return;
      }

      const amount = Number(req.body.amount);

      if (!amount) {
        return res.status(400).json({ msg: "Amount is required." });
        return;
      }

      if (isNaN(amount)) {
        return res.status(400).json({ msg: "Invalid amount." });
        return;
      }

      const update = {
        description: description,
        entry_type: entry_type,
        amount: amount,
      };

      const entry = await Accounting.findOneAndUpdate(filter, update, {
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
      const accounting_id = req.body.id;

      if (!accounting_id) {
        return res.status(400).json({ msg: "Accounting id is required." });
        return;
      }

      if (!Types.ObjectId.isValid(accounting_id)) {
        return res.status(400).json({ msg: "Invalid accounting id." });
        return;
      }

      let accounting = await Accounting.findOne({ _id: accounting_id });

      if (!accounting) {
        return res.status(400).json({ msg: "Accounting id not found." });
      }

      const deleted = await Accounting.deleteOne({ _id: accounting_id });

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

      // const total_expenses = Accounting.aggregate([{
      //     $match: {
      //       entry_type: 'expenses',
      //       raise_id: new Types.ObjectId(raise_id),
      //     }
      //   },
      //   {
      //     $group: {
      //       _id: 'expenses',
      //       sum: {
      //         $sum: {
      //           "$toInt": "$amount"
      //         }
      //       }
      //     }
      //   },
      // ]);

      const total_expenses = Accounting.aggregate([
        {
          $match: {
            entry_type: "expenses",
            raise_id: new Types.ObjectId(raise_id),
          },
        },
        {
          $project: {
            _id: 0,
            amount: 1,
          },
        },
        {
          $group: {
            _id: "expenses",
            total: {
              $sum: "$amount",
            },
          },
        },
      ]);

      console.log(await total_expenses.exec());

      const te = await total_expenses.exec();
      const expenses_sum = te[0].total;

      const total_sales = Accounting.aggregate([
        {
          $match: {
            entry_type: "income",
            raise_id: new Types.ObjectId(raise_id),
          },
        },
        {
          $group: {
            _id: "income",
            sum: {
              $sum: {
                $toInt: "$amount",
              },
            },
          },
        },
      ]);

      const ts = await total_sales.exec();
      const sales_sum = ts[0].sum;
      const net_income = sales_sum - expenses_sum;

      const payload = {
        expenses_sum,
        sales_sum,
        net_income,
      };

      return res.json(payload);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
);

export const ExpenseRoutes: Router = router;
