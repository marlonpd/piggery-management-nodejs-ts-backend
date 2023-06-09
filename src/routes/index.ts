import { Router } from 'express';
import { AuthRoutes } from './auth-routes';
import { LivestockRoutes } from './livestock-routes';
import { RaiseRoutes } from './raise-routes';
import { AccountingRoutes } from './accounting-routes';
import { NoteRoutes } from './note-routes';
import { EventRoutes } from './event-routes';
import { ExpenseRoutes } from './expense-routes';

const router: Router = Router();

router.use('/auth', AuthRoutes);
router.use('/livestocks', LivestockRoutes);
router.use('/raise', RaiseRoutes);
router.use('/accounting', AccountingRoutes);
router.use('/note', NoteRoutes);
router.use('/event', EventRoutes);
router.use('/expense', ExpenseRoutes);

export const MainRouter: Router = router;