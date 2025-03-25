// import { Request, Response, NextFunction } from "express";

// interface AuthRequest extends Request {
//     user?: {
//       id: string;
//       email: string;
//       isAdmin: boolean;
//     };
//   }
// export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
//   if (!req.user?.isAdmin) {
//     res.status(403).json({ message: "Admins only." });
//     return;
//   }
//   next();
// };

import { Request, Response, NextFunction } from "express";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  console.log("Checking if user is admin:", req.isAdmin);  // Add this log

  if (!req.isAdmin) {
    res.status(403).json({ message: "Admins only." });
    return;
  }

  next();  // If admin, proceed to the next middleware
};
