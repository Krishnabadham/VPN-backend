import express from "express"
import { param } from "express-validator";
import VpnController from "../controllers/VpnController";

const router = express.Router();

router.get("/:vpnId", 
    param("vpnId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("vpnId parameter must be a valid string"),
    VpnController.getVpn
);
router.get(
    "/search/:city", 
    param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must be a valid string"),
    VpnController.searchVpn
);

export default router;