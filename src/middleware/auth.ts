// import { auth } from "express-oauth2-jwt-bearer";
// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import User from "../models/user";

// declare global {
//   namespace Express {
//     interface Request {
//       userId: string;
//       auth0Id: string;
//     }
//   }
// }

// export const jwtCheck = auth({
//     audience: process.env.AUTH0_AUDIENCE,
//     issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
//     tokenSigningAlg: "RS256"
// });



// export const jwtParse = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith("Bearer ")) {
//     res.sendStatus(401); // Send response and stop further execution
//     return; // Explicitly return to ensure the function exits
//   }

//   const token = authorization.split(" ")[1];

//   try {
//     const decoded = jwt.decode(token) as jwt.JwtPayload;
//     const auth0Id = decoded.sub;

//     const user = await User.findOne({ auth0Id });

//     if (!user) {
//       res.sendStatus(401); // Send response and stop further execution
//       return; // Explicitly return to ensure the function exits
//     }

//     req.auth0Id = auth0Id as string;
//     req.userId = user._id.toString();
//     next(); // Pass control to the next middleware
//   } catch (error) {
//     res.sendStatus(401); // Send response and stop further execution
//     return; // Explicitly return to ensure the function exits
//   }
// };

import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

// Declare the userId and auth0Id in the Request interface globally for TypeScript
declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
      isAdmin?: boolean; // Add isAdmin to the Request object
    }
  }
}

// This middleware checks if the token is valid
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

// This middleware decodes the JWT token and fetches the user from the database
// export const jwtParse = async (req: Request, res: Response, next: NextFunction) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith("Bearer ")) {
//     res.sendStatus(401); // Unauthorized: Missing or invalid token
//     return;
//   }

//   const token = authorization.split(" ")[1]; // Extract the token

//   try {
//     // Decode the token without verifying it (to access user data)
//     const decoded = jwt.decode(token) as jwt.JwtPayload;
//     const auth0Id = decoded.sub; // The sub field is usually the unique user identifier

//     // Fetch the user from the database using auth0Id
//     const user = await User.findOne({ auth0Id });

//     if (!user) {
//       res.sendStatus(401); // Unauthorized: User not found
//       return;
//     }

//     // Attach the user's details to the request object
//     req.auth0Id = auth0Id as string;
//     req.userId = user._id.toString();
//     req.isAdmin = user.isAdmin; // Add isAdmin to the request object

//     next(); // Proceed to the next middleware/route handler
//   } catch (error) {
//     console.error(error);
//     res.sendStatus(401); // Unauthorized: Invalid token or error decoding
//   }
// };

export const jwtParse = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.sendStatus(401); // Unauthorized: Missing or invalid token
    return;
  }

  const token = authorization.split(" ")[1]; // Extract the token

  try {
    // Decode JWT token
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;

    // Fetch the user from the database using auth0Id
    const user = await User.findOne({ auth0Id });

    if (!user) {
      res.sendStatus(401); // Unauthorized: User not found
      return;
    }

    // Attach the user's details to the request object
    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    req.isAdmin = user.isAdmin; // Ensure we add `isAdmin` to `req`

    console.log("User data in jwtParse:", req.isAdmin);  // Log the `isAdmin` value to verify it's set

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Error decoding JWT", error);
    res.sendStatus(401); // Unauthorized: Invalid token or error decoding
  }
};