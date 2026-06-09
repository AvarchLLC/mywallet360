import {
  resolveDomain,
  WalletResolutionError,
} from "../services/domain-resolution.service.js";

export const resolveWalletDomain = async (req, res, next) => {
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

    next(error);
  }
};
