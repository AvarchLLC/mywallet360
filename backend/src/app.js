import express from "express";
import cors from "cors";
import resolutionRoutes from "./routes/resolution.routes.js";
import walletRoutes from "./routes/wallet.routes.js";

const app = express();

app.set("trust proxy", 1);

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/wallet", walletRoutes);
app.use("/api/resolve", resolutionRoutes);

export default app;
