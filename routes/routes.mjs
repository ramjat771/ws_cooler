import { Router } from "express";

import userRoutes from "./user.routes.mjs"
import proudctRoutes from "./product.routes.mjs"
import orderRoutes from "./order.routes.mjs"

// import transRoutes from "./transaction.routes"
const router = Router();
router.use("/user",userRoutes)
router.use("/product",proudctRoutes)
router.use("/order",orderRoutes)

export default router;
