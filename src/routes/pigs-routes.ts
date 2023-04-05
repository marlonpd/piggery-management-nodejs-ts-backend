import { NextFunction, Request, Response, Router } from 'express';

const router: Router = Router();

/**
 * GET /api/profiles/:username
 */
router.get('', (req: Request, res: Response, next: NextFunction) => {
  res.send("What's up doc ?!");
});

export const PigsRoutes: Router = router;