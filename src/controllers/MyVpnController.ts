import { Request, Response } from "express"
import Vpn from "../models/vpn";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

// const createMyVpn = async (req: Request, res: Response) => {
//     try{
//         const existingVPN = await Vpn.findOne({ user: req.userId });

//         if(existingVPN){
//             res.status(409).json({message: "User Vpn already exists"});
//             return;
//         }
        

//         const image = req.file as Express.Multer.File;
        
//         const base64Image = Buffer.from(image.buffer).toString("base64");
//         const dataURI = `data:${image.mimetype};base64,${base64Image}`;

//         const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

//         const vpn = new Vpn(req.body);
//         vpn.imageUrl = uploadResponse.url;
//         vpn.user = new mongoose.Types.ObjectId(req.userId);
//         vpn.lastUpdated = new Date();
//         await vpn.save();

//         res.status(201).send(vpn);

//     } catch(error){
//         console.log(error);
//         res.status(500).json({ message: "Something went wrong" });
//     }
// };

// export default{
//     createMyVpn,
// }

const getMyVpn = async (req: Request, res: Response) => {
    try{
        const vpn = await Vpn.findOne({user: req.userId});
        if(!vpn) {
            res.status(404).json({message: "Vpn not found" });
            return;
        }
        res.json(vpn);
    } catch(error) {
        console.log("error",error);
        res.status(500).json({message: "Error fetching VPN"});
    }
};

const createMyVpn = async (req: Request, res: Response) => {
    try {
        const existingVPN = await Vpn.findOne({ user: req.userId });

        if (existingVPN) {
            res.status(409).json({ message: "User Vpn already exists" });
            return;
        }

        // const image = req.file; // Ensure this matches the field name in multer

        // if (!image) {
        //     res.status(400).json({ message: "No image file provided" });
        //     return;
        // }

        // const base64Image = Buffer.from(image.buffer).toString("base64");
        // const dataURI = `data:${image.mimetype};base64,${base64Image}`;

        // const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

        const imageUrl = await uploadImage(req.file as Express.Multer.File)

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

const updateMyVpn = async (req: Request, res: Response) => {
    try{
        const vpn = await Vpn.findOne({
            user: req.userId,
        });

        if(!vpn) {
            res.status(404).json({ message: "vpn not found" });
            return;
        }

        vpn.vpnName = req.body.vpnName;
        vpn.city = req.body.city;
        vpn.country = req.body.country;
        vpn.menuItems = req.body.menuItems;
        vpn.lastUpdated = new Date();

        if(req.file){
            const imageUrl = await uploadImage(req.file as Express.Multer.File);
            vpn.imageUrl = imageUrl;
        }

        await vpn.save();
        res.status(200).send(vpn);

    } catch(error) {
        console.log("error", error);
        res.status(500).json({message: "Something went wrong"})
    }
};

const uploadImage = async (file: Express.Multer.File) =>{
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;
};

export default{
    getMyVpn,
    createMyVpn,
    updateMyVpn,
};