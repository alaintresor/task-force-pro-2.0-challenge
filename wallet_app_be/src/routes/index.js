import express from "express";
import docrouter from "../documentation/index.doc";

const router = express.Router();

router.use("/docs", docrouter);
router.use("/auth", require("./authRoute"));
router.use("/users", require("./userRoute"));
router.use("/accounts", require("./accountRoute"));
router.use("/categories", require("./categoryRoute"));
router.use("/subcategories", require("./subCategoryRoute"));
router.use("/transactions", require("./transactionRoute"));
router.use("/budgets", require("./budgetRoute"));

export default router;
