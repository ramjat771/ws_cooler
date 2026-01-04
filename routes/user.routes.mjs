import { Router } from "express";
import * as userController from "../controller/user.controller.mjs";

const router = Router();

router.post("/", userController.createUserController);
router.get("/", userController.getAllUsersController);
router.get("/:id", userController.getUserByIdController);
router.patch("/:id", userController.updateUserController);
router.delete("/:id", userController.deleteUserController);
router.get("/email/:email", userController.getUserByEmailController);

export default router;
