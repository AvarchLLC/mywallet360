import express from "express";
import { resolveWalletDomain } from "../controllers/resolution.controller.js";
import { domainResolutionRateLimit } from "../middleware/rate-limit.middleware.js";

const router = express.Router();

router.get("/:identifier", domainResolutionRateLimit, resolveWalletDomain);

export default router;
