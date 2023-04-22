import { Router } from 'express';
import { AuthRoutes } from './auth-routes';
import { LivestockRoutes } from './livestock-routes';
import { RaiseRoutes } from './raise-routes';

const router: Router = Router();

router.use('/auth', AuthRoutes);
router.use('/livestocks', LivestockRoutes);
router.use('/raise', RaiseRoutes);

export const MainRouter: Router = router;