import { NextFunction, Request, Response, Router } from 'express';

const router: Router = Router();

router.get('signup', (req: Request, res: Response, next: NextFunction) => {
  const {name, password, email } = req.body;
  
  res.send("What's up doc ?!");
});

router.get('signin', (req: Request, res: Response, next: NextFunction) => {
  res.send("What's up doc ?!");
});


export const AuthRoutes: Router = router;