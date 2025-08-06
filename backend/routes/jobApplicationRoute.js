import express from "express";
import {
  createJobApplication,
  listJobApplications,
  editJobApplication,
  removeJobApplication
} from "../controllers/jobApplicationController.js";

const router = express.Router();

// Başvuru ekle
router.post("/", createJobApplication);
// Başvuruları getir (opsiyonel user_id ile)
router.get("/", listJobApplications);
// Başvuru güncelle
router.put("/:id", editJobApplication);
// Başvuru sil
router.delete("/:id", removeJobApplication);

export default router;