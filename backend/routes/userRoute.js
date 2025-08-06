import express from "express";
import {
  getProfile,
  updateProfile,
  addCert,
  updateCert,
  deleteCert,
  addEdu,
  updateEdu,
  deleteEdu,
  addExp,
  updateExp,
  deleteExp
} from "../controllers/userController.js";

const router = express.Router();

// Profil işlemleri
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Sertifika işlemleri
router.post("/certifications", addCert);
router.put("/certifications/:certificationId", updateCert);
router.delete("/certifications/:certificationId", deleteCert);

// Eğitim işlemleri
router.post("/educations", addEdu);
router.put("/educations/:educationId", updateEdu);
router.delete("/educations/:educationId", deleteEdu);

// İş deneyimi işlemleri
router.post("/experiences", addExp);
router.put("/experiences/:experienceId", updateExp);
router.delete("/experiences/:experienceId", deleteExp);

export default router; 