import { Router } from "express";
import * as userController from "../controller/user.controller.mjs";

const router = Router();

router.post("/", userController.createUserController);

// 🔥 DEVICE MANAGEMENT
router.post("/:id/device", userController.addDeviceController);
router.delete("/:id/device", userController.removeDeviceController);

export default router;
