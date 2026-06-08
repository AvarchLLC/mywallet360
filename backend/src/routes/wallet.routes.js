import express from "express";
import { getWalletProfile } from "../controllers/wallet.controller.js";
import { walletAnalysisRateLimit } from "../middleware/rate-limit.middleware.js";

const router = express.Router();

router.get("/:address", walletAnalysisRateLimit, getWalletProfile);

export default router;
