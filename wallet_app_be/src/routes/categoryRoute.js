import express from "express";
import CategoryController from "../controllers/categoryController";

const router = express.Router();

router.get("/", CategoryController.getAllCategories);
router.post("/", CategoryController.createCategory);
router.get("/:categoryId", CategoryController.getCategoryById);
router.put("/:categoryId", CategoryController.updateCategory);
router.delete("/:categoryId", CategoryController.deleteCategory);

export default router;
