import { Router } from 'express';
import { AuthRoutes } from './auth-routes';
import { LivestockRoutes } from './livestock-routes';

const router: Router = Router();

router.use('/auth', AuthRoutes);
router.use('/livestocks', LivestockRoutes);

export const MainRouter: Router = router;