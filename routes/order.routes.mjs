import { Router } from "express";
import * as orderController from "../controller/order.controller.mjs";

const router = Router();

router.post("/", orderController.createOrderController);
router.get("/", orderController.getAllOrdersController);

// ✅ NEW ROUTE (keep above :id)
router.get("/user/:userId", orderController.getOrdersByUserIdController);

router.get("/:id", orderController.getOrderByIdController);
router.put("/:id", orderController.updateOrderController);
router.delete("/:id", orderController.deleteOrderController);

export default router;
