import { NextFunction, Request, Response } from 'express';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role || 'owner';

    if (!role) {
      return res.status(403).json({ msg: 'Role not found.' });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ msg: 'You do not have permission for this action.' });
    }

    return next();
  };
};
