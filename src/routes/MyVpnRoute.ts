// import express from "express"
// import multer from "multer";
// import MyVpnController from "../controllers/MyVpnController";
// import { jwtCheck, jwtParse } from "../middleware/auth";
// import { validateMyVpnRequest } from "../middleware/validation";

// const router = express.Router();

// const storage = multer.memoryStorage();
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 5 * 1024 * 1024, //5mb
//     },
// });

// // /api/my/vpn

// router.get("/",jwtCheck,jwtParse, MyVpnController.getMyVpn);
// router.post("/", upload.single("imageFile"), validateMyVpnRequest, jwtCheck, jwtParse, MyVpnController.createMyVpn);
// router.put('/', upload.single("imageFile"), validateMyVpnRequest, jwtCheck, jwtParse, MyVpnController.updateMyVpn);

// export default router;


import express from "express";
import multer from "multer";
import MyVpnController from "../controllers/MyVpnController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyVpnRequest } from "../middleware/validation";
import { requireAdmin } from "../middleware/requireAdmin"; // ✅ Import admin guard

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Base: /api/my/vpn
router.patch("/order/:orderId/status", jwtCheck, jwtParse, requireAdmin,  MyVpnController.updateOrderStatus);

router.get("/order", jwtCheck, jwtParse, requireAdmin, MyVpnController.getMyVpnOrders);

// 🟢 Allow any authenticated user to fetch their VPN
router.get("/", jwtCheck, jwtParse, MyVpnController.getMyVpn);

// 🔒 Only admins can create/update VPNs


router.post(
  "/",
  upload.single("imageFile"),
  validateMyVpnRequest,
  jwtCheck,
  jwtParse,
  requireAdmin, // ✅ Admins only
  MyVpnController.createMyVpn
);

router.put(
  "/",
  upload.single("imageFile"),
  validateMyVpnRequest,
  jwtCheck,
  jwtParse,
  requireAdmin, // ✅ Admins only
  MyVpnController.updateMyVpn
);

export default router;
