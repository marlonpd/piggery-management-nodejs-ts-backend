import { NextFunction, Request, Response, Router } from 'express';

const router: Router = Router();


router.get('', (req: Request, res: Response, next: NextFunction) => {
  const {name, password, email } = req.body;
  
  res.send("What's up doc ?!");
});

router.post('save', (req: Request, res: Response, next: NextFunction) => {
  res.send("What's up doc ?!");
});

router.post('update', (req: Request, res: Response, next: NextFunction) => {
  res.send("What's up doc ?!");
});

router.post('remove', (req: Request, res: Response, next: NextFunction) => {
  res.send("What's up doc ?!");
});



export const LivestockRoutes: Router = router;