import { Router } from "express";
import * as productController from "../controller/product.controller.mjs";
import { upload } from "../middlewares/multer.mjs";
import { filesToBody } from "../middlewares/file-to-body.middleware.mjs";
const router = Router();

router.post("/",upload.any(), filesToBody, productController.createProductController);
router.get("/", productController.getAllProductsController);
router.get("/:id", productController.getProductByIdController);
router.put("/:id", productController.updateProductController);
router.delete("/:id", productController.deleteProductController);

export default router;
