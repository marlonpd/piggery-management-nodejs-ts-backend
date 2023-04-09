import { Router } from 'express';
import { LivestockRoutes } from './livestock-routes';

const router: Router = Router();

router.use('/pigs', LivestockRoutes);

export const MainRouter: Router = router;