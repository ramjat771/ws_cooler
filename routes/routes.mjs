import { Router } from "express";

import userRoutes from "./user.routes.mjs"

// import transRoutes from "./transaction.routes"
const router = Router();
router.use("/user",userRoutes)

export default router;
