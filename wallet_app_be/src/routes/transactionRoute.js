import express from "express";
import TransactionController from "../controllers/transactionController";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.get("/report", protect, TransactionController.getTransactionReport);
router.get(
  "/:accountId/report",
  protect,
  TransactionController.getTransactionReportByAccount
);
router.post("/", protect, TransactionController.createTransaction);
router.get("/", protect, TransactionController.getAllTransactions);
router.get(
  "/:transactionId",
  protect,
  TransactionController.getTransactionById
);
router.put("/:transactionId", protect, TransactionController.updateTransaction);
router.delete(
  "/:transactionId",
  protect,
  TransactionController.deleteTransaction
);
router.get(
  "/category/:categoryId/report",
  protect,
  TransactionController.getTransactionReportByCategory
);

export default router;
