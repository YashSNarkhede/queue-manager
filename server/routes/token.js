import express from "express";
import Token from "../models/Token.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

// Add new token to a queue
router.post("/add", authenticate, async (req, res) => {
  const { queueId } = req.body;

  const lastToken = await Token.find({ queueId })
    .sort({ number: -1 })
    .limit(1);

  const newToken = new Token({
    queueId,
    number: lastToken.length ? lastToken[0].number + 1 : 1,
    status: "waiting",
  });

  await newToken.save();
  res.json(newToken);
});

// Get all tokens for a queue
router.get("/queue/:queueId", authenticate, async (req, res) => {
  const { queueId } = req.params;
  const tokens = await Token.find({ queueId }).sort({ number: 1 });
  res.json(tokens);
});

// Assign token (change first waiting token to "assigned")
router.patch("/assign/:queueId", authenticate, async (req, res) => {
  const { queueId } = req.params;

  const token = await Token.findOne({
    queueId,
    status: "waiting",
  }).sort({ number: 1 });

  if (!token) return res.status(404).json({ message: "No tokens to assign" });

  token.status = "assigned";
  token.assignedAt = new Date();
  await token.save();

  res.json(token);
});

// Cancel token
router.delete("/:tokenId", authenticate, async (req, res) => {
  const { tokenId } = req.params;
  const token = await Token.findById(tokenId);
  if (!token) return res.status(404).json({ message: "Token not found" });

  token.status = "cancelled";
  await token.save();

  res.json({ message: "Token cancelled" });
});
router.delete("/:tokenId", authenticate, async (req, res) => {
  const { tokenId } = req.params;

  const token = await Token.findByIdAndDelete(tokenId);
  if (!token) return res.status(404).json({ message: "Token not found" });

  res.json({ message: "Token deleted" });
});

// Move token up or down
router.patch("/move/:tokenId", authenticate, async (req, res) => {
  const { tokenId } = req.params;
  const { direction } = req.body; // "up" or "down"

  const token = await Token.findById(tokenId);
  if (!token) return res.status(404).json({ message: "Token not found" });

  const queueTokens = await Token.find({
    queueId: token.queueId,
    status: "waiting",
  }).sort("number");

  const index = queueTokens.findIndex((t) => t._id.equals(tokenId));
  if (
    (direction === "up" && index === 0) ||
    (direction === "down" && index === queueTokens.length - 1)
  )
    return res.status(400).json({ message: "Cannot move in that direction" });

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  const targetToken = queueTokens[swapIndex];

  // Swap their numbers
  const temp = token.number;
  token.number = targetToken.number;
  targetToken.number = temp;

  await token.save();
  await targetToken.save();

  res.json({ message: "Token moved" });
});

export default router;
