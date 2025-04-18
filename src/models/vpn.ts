import mongoose, { InferSchemaType } from "mongoose";

const menuItemSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, default: () => new mongoose.Types.ObjectId(), },
    name: { type: String, required: true },
    price: { type: Number, required: true },  
});

export type MenuItemType = InferSchemaType<typeof menuItemSchema>;

const vpnSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vpnName: {type: String, required: true},
    city: {type: String, required: true},
    country: {type: String, required: true},
    menuItems: [menuItemSchema],
    imageUrl: {type: String, required : true},
    lastUpdated: {type: Date, required : true},
});

const Vpn = mongoose.model("Vpn", vpnSchema);
export default Vpn;