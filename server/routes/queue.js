import express from "express";
import Queue from "../models/Queue.js";
import Token from "../models/Token.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

// Get all queues created by user
router.get("/", authenticate, async (req, res) => {
  try {
    const queues = await Queue.find({ createdBy: req.user.id });
    res.json(queues);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new queue
router.post("/create", authenticate, async (req, res) => {
  const { name } = req.body;

  const newQueue = new Queue({
    name,
    createdBy: req.user.id,
  });

  await newQueue.save();
  res.json(newQueue);
});

// Analytics for a specific queue
router.get("/analytics/:queueId", authenticate, async (req, res) => {
  const { queueId } = req.params;

  const tokens = await Token.find({ queueId });

  const waiting = tokens.filter((t) => t.status === "waiting").length;
  const assigned = tokens.filter((t) => t.status === "assigned");

  // Calculate average wait time in minutes
  const waitTimes = assigned.map((t) => {
    const waitMs = new Date(t.assignedAt) - new Date(t.createdAt);
    return waitMs / (1000 * 60);
  });

  const avgWait =
    waitTimes.length > 0
      ? (waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length).toFixed(2)
      : 0;

  res.json({
    currentQueueLength: waiting,
    assignedCount: assigned.length,
    averageWaitTimeMins: avgWait,
  });
});
router.delete("/:queueId", authenticate, async (req, res) => {
  const { queueId } = req.params;

  try {
    await Token.deleteMany({ queueId });
    await Queue.findByIdAndDelete(queueId);

    res.json({ message: "Queue and tokens deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete queue" });
  }
});

export default router;
