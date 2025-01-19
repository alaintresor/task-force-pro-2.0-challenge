import express from "express";
import BudgetController from "../controllers/budgetController";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.post("/", protect, BudgetController.createBudget);
router.get("/:id", protect, BudgetController.getBudgetById);
router.put("/:id", protect, BudgetController.updateBudget);
router.delete("/:id", protect, BudgetController.deleteBudget);
router.get("/", protect, BudgetController.getAllBudgets);

export default router;
