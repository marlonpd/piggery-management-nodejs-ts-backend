import { Router } from 'express';
import { AuthRoutes } from './auth-routes';
import { LivestockRoutes } from './livestock-routes';
import { RaiseRoutes } from './raise-routes';
import { AccountingRoutes } from './accounting-routes';
import { NoteRoutes } from './note-routes';
import { EventRoutes } from './event-routes';
import { ExpenseRoutes } from './expense-routes';
import { FeedingGuideRoutes } from './feeding-guide-routes';
import { SowHistoryRoutes } from './sow-history-routes';
import { DashboardRoutes } from './dashboard-routes';
import { FeedInventoryRoutes } from './feed-inventory-routes';
import { ReminderRoutes } from './reminder-routes';
import { AlertsRoutes } from './alerts-routes';
import { ReportRoutes } from './report-routes';

const router: Router = Router();

router.use('/auth', AuthRoutes);
router.use('/dashboard', DashboardRoutes);
router.use('/alerts', AlertsRoutes);
router.use('/report', ReportRoutes);
router.use('/livestocks', LivestockRoutes);
router.use('/raise', RaiseRoutes);
router.use('/accounting', AccountingRoutes);
router.use('/note', NoteRoutes);
router.use('/event', EventRoutes);
router.use('/expense', ExpenseRoutes);
router.use('/feeding-guide', FeedingGuideRoutes);
router.use('/sow-history', SowHistoryRoutes);
router.use('/feed-inventory', FeedInventoryRoutes);
router.use('/reminder', ReminderRoutes);

export const MainRouter: Router = router;