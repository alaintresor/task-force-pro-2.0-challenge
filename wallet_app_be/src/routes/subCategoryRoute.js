import express from "express";
import SubCategoryController from "../controllers/subCategoryController";

const router = express.Router();

router.get("/", SubCategoryController.getAllSubCategories);
router.post("/", SubCategoryController.createSubCategory);
router.get("/:subCategoryId", SubCategoryController.getSubCategoryById);
router.put("/:subCategoryId", SubCategoryController.updateSubCategory);
router.delete("/:subCategoryId", SubCategoryController.deleteSubCategory);

export default router;
