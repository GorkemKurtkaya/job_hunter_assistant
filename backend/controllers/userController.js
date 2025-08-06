import { 
  getUserProfile, 
  updateUserProfile,
  addCertification,
  updateCertification,
  deleteCertification,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience
} from "../services/userService.js";

// Kullanıcı profilini getir
const getProfile = async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(401).json({ error: "Kullanıcı kimliği bulunamadı" });
    }

    const profile = await getUserProfile(userId);
    res.status(200).json({ profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Kullanıcı profilini güncelle
const updateProfile = async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(401).json({ error: "Kullanıcı kimliği bulunamadı" });
    }

    const profileData = req.body;
    const updatedProfile = await updateUserProfile(userId, profileData);
    res.status(200).json({ 
      message: "Profil güncellendi", 
      profile: updatedProfile 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Sertifika ekle
const addCert = async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(401).json({ error: "Kullanıcı kimliği bulunamadı" });
    }

    const certificationData = req.body;
    const newCertification = await addCertification(userId, certificationData);
    res.status(201).json({ 
      message: "Sertifika eklendi", 
      certification: newCertification 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Sertifika güncelle
const updateCert = async (req, res) => {
  try {
    const { certificationId } = req.params;
    const certificationData = req.body;
    
    const updatedCertification = await updateCertification(certificationId, certificationData);
    res.status(200).json({ 
      message: "Sertifika güncellendi", 
      certification: updatedCertification 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Sertifika sil
const deleteCert = async (req, res) => {
  try {
    const { certificationId } = req.params;
    
    await deleteCertification(certificationId);
    res.status(200).json({ message: "Sertifika silindi" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eğitim ekle
const addEdu = async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(401).json({ error: "Kullanıcı kimliği bulunamadı" });
    }

    const educationData = req.body;
    const newEducation = await addEducation(userId, educationData);
    res.status(201).json({ 
      message: "Eğitim eklendi", 
      education: newEducation 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eğitim güncelle
const updateEdu = async (req, res) => {
  try {
    const { educationId } = req.params;
    const educationData = req.body;
    
    const updatedEducation = await updateEducation(educationId, educationData);
    res.status(200).json({ 
      message: "Eğitim güncellendi", 
      education: updatedEducation 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eğitim sil
const deleteEdu = async (req, res) => {
  try {
    const { educationId } = req.params;
    
    await deleteEducation(educationId);
    res.status(200).json({ message: "Eğitim silindi" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// İş deneyimi ekle
const addExp = async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(401).json({ error: "Kullanıcı kimliği bulunamadı" });
    }

    const experienceData = req.body;
    const newExperience = await addExperience(userId, experienceData);
    res.status(201).json({ 
      message: "İş deneyimi eklendi", 
      experience: newExperience 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// İş deneyimi güncelle
const updateExp = async (req, res) => {
  try {
    const { experienceId } = req.params;
    const experienceData = req.body;
    
    const updatedExperience = await updateExperience(experienceId, experienceData);
    res.status(200).json({ 
      message: "İş deneyimi güncellendi", 
      experience: updatedExperience 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// İş deneyimi sil
const deleteExp = async (req, res) => {
  try {
    const { experienceId } = req.params;
    
    await deleteExperience(experienceId);
    res.status(200).json({ message: "İş deneyimi silindi" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
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
}; 