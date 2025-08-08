import express from "express";
const router = express.Router();
import { getJobAnalysis } from "../controllers/aiController.js";

router.post("/analyze", getJobAnalysis);

export default router;