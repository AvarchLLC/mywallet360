import {
  resolveDomain,
  WalletResolutionError,
} from "../services/domain-resolution.service.js";

export const resolveWalletDomain = async (req, res) => {
  try {
    const result = await resolveDomain(req.params.identifier || "");
    res.json(result);
  } catch (error) {
    if (error instanceof WalletResolutionError) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
      });
    }

    console.error("Wallet domain resolution failed:", error);
    return res.status(500).json({
      code: "RESOLUTION_FAILED",
      message: "We could not resolve that domain right now. Please try again.",
    });
  }
};

