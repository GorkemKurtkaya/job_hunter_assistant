import express from "express";
import {
  createJobApplication,
  listJobApplications,
  editJobApplication,
  removeJobApplication,
  getIdByJobApplication
} from "../controllers/jobApplicationController.js";

const router = express.Router();

// Başvuru ekle
router.post("/", createJobApplication);
// Tek başvuru getir
router.get("/:id", getIdByJobApplication); // Bu satırın amacı tek başvuru getirmek, ancak fonksiyon listJobApplications olarak adlandırılmış. İsimlendirme hatası olabilir.
// Başvuruları getir (opsiyonel user_id ile)
router.get("/", listJobApplications);
// Başvuru güncelle
router.put("/:id", editJobApplication);
// Başvuru sil
router.delete("/:id", removeJobApplication);

export default router;