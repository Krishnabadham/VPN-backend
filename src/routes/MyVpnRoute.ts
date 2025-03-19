import express from "express"
import multer from "multer";
import MyVpnController from "../controllers/MyVpnController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyVpnRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, //5mb
    },
});

// /api/my/vpn

router.get("/",jwtCheck,jwtParse, MyVpnController.getMyVpn);
router.post("/", upload.single("imageFile"), validateMyVpnRequest, jwtCheck, jwtParse, MyVpnController.createMyVpn);
router.put('/', upload.single("imageFile"), validateMyVpnRequest, jwtCheck, jwtParse, MyVpnController.updateMyVpn);

export default router;
