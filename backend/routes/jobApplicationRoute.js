import express from "express";
import {
  createJobApplication,
  listJobApplications,
  editJobApplication,
  removeJobApplication,
  getIdByJobApplication
} from "../controllers/jobApplicationController.js";

const router = express.Router();


router.post("/", createJobApplication);
router.get("/:id", getIdByJobApplication); 
router.get("/", listJobApplications);
router.put("/:id", editJobApplication);
router.delete("/:id", removeJobApplication);

export default router;