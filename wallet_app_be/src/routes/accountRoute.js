import express from "express";
import AccountController from "../controllers/accountController";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.post("/", protect, AccountController.createAccount);
router.get("/", protect, AccountController.getAccountsByUser);
router.get("/:accountId", protect, AccountController.getAccountById);
router.put("/:accountId", protect, AccountController.updateAccount);
router.delete("/:accountId", protect, AccountController.deleteAccount);

export default router;
