import { Request, Response } from "express"
import Vpn from "../models/vpn";

const getVpn = async(req: Request, res: Response) => {
    try{
        const vpnId = req.params.vpnId;

        const vpn = await Vpn.findById(vpnId);

        if(!vpn){
            res.status(404).json({message: "vpn not found"});
            return;
        }

        res.json(vpn);

    }catch(error){
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const searchVpn = async (req: Request, res: Response) => {
    try{
        const city = req.params.city;

        const searchQuery = (req.query.searchQuery as string) || "";
        const sortOption = (req.query.sortOption as string) || "lastUpdated";
        const page = parseInt(req.query.page as string)  || 1;

        let query: any = {}

        query["city"] = new RegExp(city, "i");
        const cityCheck = await Vpn.countDocuments(query);
        if (cityCheck === 0) {
            res.status(404).json({
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    pages: 1,
                },
            });
            return;
        }

        if(searchQuery){
            const searchRegex = new RegExp(searchQuery, "i");
            query["$or"] = [
                { vpnName: searchRegex },
            ];
        }

        const pageSize = 10;
        const skip = (page -1) * pageSize;
        const vpns = await Vpn.find(query)
            .sort({ [sortOption]: 1})
            .skip(skip)
            .limit(pageSize)
            .lean();

        const total = await Vpn.countDocuments(query);

        const response = {
            data: vpns,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / pageSize), 
            },
        };

        res.json(response)

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"})
    }
};

export default {
    getVpn,
    searchVpn,
}