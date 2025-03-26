// import { Request, Response } from "express"
// import Vpn from "../models/vpn";
// import cloudinary from "cloudinary";
// import mongoose from "mongoose";

// // const createMyVpn = async (req: Request, res: Response) => {
// //     try{
// //         const existingVPN = await Vpn.findOne({ user: req.userId });

// //         if(existingVPN){
// //             res.status(409).json({message: "User Vpn already exists"});
// //             return;
// //         }
        

// //         const image = req.file as Express.Multer.File;
        
// //         const base64Image = Buffer.from(image.buffer).toString("base64");
// //         const dataURI = `data:${image.mimetype};base64,${base64Image}`;

// //         const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

// //         const vpn = new Vpn(req.body);
// //         vpn.imageUrl = uploadResponse.url;
// //         vpn.user = new mongoose.Types.ObjectId(req.userId);
// //         vpn.lastUpdated = new Date();
// //         await vpn.save();

// //         res.status(201).send(vpn);

// //     } catch(error){
// //         console.log(error);
// //         res.status(500).json({ message: "Something went wrong" });
// //     }
// // };

// // export default{
// //     createMyVpn,
// // }

// const getMyVpn = async (req: Request, res: Response) => {
//     try{
//         const vpn = await Vpn.findOne({user: req.userId});
//         if(!vpn) {
//             res.status(404).json({message: "Vpn not found" });
//             return;
//         }
//         res.json(vpn);
//     } catch(error) {
//         console.log("error",error);
//         res.status(500).json({message: "Error fetching VPN"});
//     }
// };

// const createMyVpn = async (req: Request, res: Response) => {
//     try {
//         const existingVPN = await Vpn.findOne({ user: req.userId });

//         if (existingVPN) {
//             res.status(409).json({ message: "User Vpn already exists" });
//             return;
//         }

//         // const image = req.file; // Ensure this matches the field name in multer

//         // if (!image) {
//         //     res.status(400).json({ message: "No image file provided" });
//         //     return;
//         // }

//         // const base64Image = Buffer.from(image.buffer).toString("base64");
//         // const dataURI = `data:${image.mimetype};base64,${base64Image}`;

//         // const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

//         const imageUrl = await uploadImage(req.file as Express.Multer.File)

//         const vpn = new Vpn(req.body);
//         vpn.imageUrl = imageUrl;
//         vpn.user = new mongoose.Types.ObjectId(req.userId);
//         vpn.lastUpdated = new Date();
//         await vpn.save();

//         res.status(201).send(vpn);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Something went wrong" });
//     }
// };

// const updateMyVpn = async (req: Request, res: Response) => {
//     try{
//         const vpn = await Vpn.findOne({
//             user: req.userId,
//         });

//         if(!vpn) {
//             res.status(404).json({ message: "vpn not found" });
//             return;
//         }

//         vpn.vpnName = req.body.vpnName;
//         vpn.city = req.body.city;
//         vpn.country = req.body.country;
//         vpn.menuItems = req.body.menuItems;
//         vpn.lastUpdated = new Date();

//         if(req.file){
//             const imageUrl = await uploadImage(req.file as Express.Multer.File);
//             vpn.imageUrl = imageUrl;
//         }

//         await vpn.save();
//         res.status(200).send(vpn);

//     } catch(error) {
//         console.log("error", error);
//         res.status(500).json({message: "Something went wrong"})
//     }
// };

// const uploadImage = async (file: Express.Multer.File) =>{
//     const image = file;
//     const base64Image = Buffer.from(image.buffer).toString("base64");
//     const dataURI = `data:${image.mimetype};base64,${base64Image}`;
//     const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
//     return uploadResponse.url;
// };

// export default{
//     getMyVpn,
//     createMyVpn,
//     updateMyVpn,
// };

import { Request, Response } from "express";
import Vpn from "../models/vpn";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Order from "../models/order";

// Extend Express Request to include `user` from jwtParse middleware
// interface AuthRequest extends Request {
//   user?: {
//     id: string;
//     email: string;
//     isAdmin: boolean;
//   };
// }

// ─────────────────────────────────────────────
// GET VPN (Accessible to all authenticated users)
// ─────────────────────────────────────────────
const getMyVpn = async (req: Request, res: Response) => {
  try {
    const vpn = await Vpn.findOne({ user: req.userId });

    if (!vpn) {
      res.status(404).json({ message: "VPN not found" });
      return;
    }

    res.json(vpn);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching VPN" });
  }
};

// ─────────────────────────────────────────────
// CREATE VPN (Admins only)
// ─────────────────────────────────────────────
const createMyVpn = async (req: Request, res: Response) => {
  try {
    // 🔐 Admin check
    // if (!req.user?.isAdmin) {
    //   res.status(403).json({ message: "Access denied. Admins only." });
    //   return;
    // }

    const existingVPN = await Vpn.findOne({ user: req.userId });
    if (existingVPN) {
      res.status(409).json({ message: "User VPN already exists" });
      return;
    }

    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    const vpn = new Vpn(req.body);
    vpn.imageUrl = imageUrl;
    vpn.user = new mongoose.Types.ObjectId(req.userId);
    vpn.lastUpdated = new Date();
    await vpn.save();

    res.status(201).send(vpn);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ─────────────────────────────────────────────
// UPDATE VPN (Admins only)
// ─────────────────────────────────────────────
const updateMyVpn = async (req: Request, res: Response) => {
  try {
    // 🔐 Admin check
    // if (!req.user?.isAdmin) {
    //   res.status(403).json({ message: "Access denied. Admins only." });
    //   return;
    // }

    const vpn = await Vpn.findOne({ user: req.userId });
    if (!vpn) {
      res.status(404).json({ message: "VPN not found" });
      return;
    }

    vpn.vpnName = req.body.vpnName;
    vpn.city = req.body.city;
    vpn.country = req.body.country;
    vpn.menuItems = req.body.menuItems;
    vpn.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      vpn.imageUrl = imageUrl;
    }

    await vpn.save();
    res.status(200).send(vpn);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getMyVpnOrders = async(req:Request, res: Response) => {
  try{
    const vpn = await Vpn.findOne({user: req.userId});
    if(!vpn){
      res.status(404).json({message: "vpn not found"});
      return;
    }

    const orders = await Order.find({vpn: vpn._id}).populate("vpn").populate("user");
    res.json(orders);

  }catch(error){
    console.log(error);
    res.status(500).json({message: "something went wrong"});
  }
};

const updateOrderStatus = async (req:Request, res:Response) => {
  try{
    const {orderId} = req.params;
    const {status} = req.body;

    const order = await Order.findById(orderId);
    if(!order){
      res.status(404).json({message: "order not found"});
      return;
    }
    const vpn = await Vpn.findById(order.vpn);

    if(vpn?.user?._id.toString() !== req.userId){
      res.status(401).send();
      return;
    }
    order.status = status;
    await order.save();

    res.status(200).json(order);

  }catch(error){
    console.log(error);
    res.status(500).json({message: "unable to update order status"});
  }
};

// ─────────────────────────────────────────────
// Image Upload Helper
// ─────────────────────────────────────────────
const uploadImage = async (file: Express.Multer.File) => {
  const base64Image = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${file.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

// ─────────────────────────────────────────────

export default {
  updateOrderStatus,
  getMyVpnOrders,
  getMyVpn,
  createMyVpn,
  updateMyVpn,
};
