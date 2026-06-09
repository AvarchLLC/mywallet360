import { getWalletData } from "../services/etherscan.service.js";
import { isAddress } from "ethers";
import { HttpError } from "../middleware/error.middleware.js";

export const getWalletProfile = async (req, res, next) => {
  const { address } = req.params;

  if (!isAddress(address)) {
    next(new HttpError(400, "INVALID_WALLET_ADDRESS", "Enter a valid Ethereum wallet address."));
    return;
  }

  try {
    const walletData = await getWalletData(address);
    res.set("Cache-Control", "private, max-age=60, stale-while-revalidate=240");
    res.json(walletData);
  } catch (error) {
    next(error);
  }
};
