import { Router } from 'express';
import { PigsRoutes } from './pigs-routes';

const router: Router = Router();

router.use('/pigs', PigsRoutes);

export const MainRouter: Router = router;