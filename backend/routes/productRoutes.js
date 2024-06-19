import express from "express";
import { fetchAllProducts } from "../controllers/productControllers.js";
const router = express.Router();
router.route("/:categoryname/products/").get(fetchAllProducts);

export default router;
