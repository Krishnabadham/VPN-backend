// import { Request, Response } from "express";
// import User from "../models/user";

// const getCurrentUser = async (req: Request, res: Response) => {
//     try{
//         const currentUser = await User.findOne({_id: req.userId});
//         if (!currentUser){
//             res.status(404).json({ message: "User not found" });
//             return 
//         }
//         res.json(currentUser);
//     } catch(error) {
//         console.log(error);
//         res.status(500).json({message: "Something went wrong"});
//         return 
//     }
// };

// const createCurrentUser = async (req: Request, res: Response) => {
//     try{
//         const { auth0Id } = req.body;
        
//         const existingUser = await User.findOne({ auth0Id });

//         if (existingUser) {
//             res.status(200).send();
//             return;
//         }

//         const newUser = new User({
//             ...req.body,
//             isAdmin: req.body.isAdmin || false,
//         });
//         await newUser.save();

//         res.status(201).json(newUser.toObject());

//     }catch (error){
//         console.log(error);
//         res.status(500).json({message: "Error creating user"});
//     }
// };

// const updateCurrentUser = async (req: Request, res: Response) => {
//     try {
//         const { name, addressLine1, country, city } = req.body;
//         const user = await User.findById(req.userId);

//         if (!user) {
//             res.status(404).json({ message: "User not found" });
//             return ;
//         }

//         user.name = name;
//         user.addressLine1 = addressLine1;
//         user.city = city;
//         user.country = country;

//         await user.save();

//         res.send(user);

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({message: "Error updating user" });
//     }
// };

// export default { 
//     getCurrentUser,
//     createCurrentUser,
//     updateCurrentUser,
// };

import { Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const currentUser = await User.findOne({ _id: req.userId });
        if (!currentUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Send only required fields (avoid exposing internal fields)
        res.json({
            name: currentUser.name,
            email: currentUser.email,
            isAdmin: currentUser.isAdmin,
            addressLine1: currentUser.addressLine1,
            city: currentUser.city,
            country: currentUser.country,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const createCurrentUser = async (req: Request, res: Response) => {
    try {
        const { auth0Id, name, email, addressLine1, city, country } = req.body;

        const existingUser = await User.findOne({ auth0Id });
        if (existingUser) {
            res.status(200).send();
            return;
        }

        // Explicitly set allowed fields; ignore anything else (like isAdmin)
        const newUser = new User({
            auth0Id,
            name,
            email,
            addressLine1,
            city,
            country,
            isAdmin: false, // ✅ Prevent self-promotion
        });

        await newUser.save();

        res.status(201).json({
            name: newUser.name,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            addressLine1: newUser.addressLine1,
            city: newUser.city,
            country: newUser.country,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating user" });
    }
};

const updateCurrentUser = async (req: Request, res: Response) => {
    try {
        const { name, addressLine1, country, city } = req.body;

        const user = await User.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.name = name;
        user.addressLine1 = addressLine1;
        user.city = city;
        user.country = country;

        await user.save();

        res.send({
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            addressLine1: user.addressLine1,
            city: user.city,
            country: user.country,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating user" });
    }
};

export default {
    getCurrentUser,
    createCurrentUser,
    updateCurrentUser,
};
