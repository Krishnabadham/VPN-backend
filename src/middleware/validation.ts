import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async ( req: Request, res: Response, next : NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return ;
    }
    next();
};

export const validateMyUserRequest =[
    body("name").isString().notEmpty().withMessage("Name must be a string"),
    body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a string"),
    body("city").isString().notEmpty().withMessage("City muty be a string"),
    body("country").isString().notEmpty().withMessage("Country must be a string"),
    handleValidationErrors,
];

// import { Request, Response, NextFunction } from "express";
// import { body, validationResult, ValidationChain } from "express-validator";

// // Custom error-handling middleware
// const handleValidationErrors = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     res.status(400).json({ errors: errors.array() }); // Send response
//     return; // Stop further execution
//   }
//   next(); // Pass control to the next middleware
// };

// // Validation middleware array
// export const validateMyUserRequest: (ValidationChain | typeof handleValidationErrors)[] = [
//   body("name").isString().notEmpty().withMessage("Name must be a string"),
//   body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a string"),
//   body("city").isString().notEmpty().withMessage("City must be a string"),
//   body("country").isString().notEmpty().withMessage("Country must be a string"),
//   handleValidationErrors,
// ];