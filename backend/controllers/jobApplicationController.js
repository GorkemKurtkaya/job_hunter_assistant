import {
  addJobApplication,
  getJobApplications,
  updateJobApplication,
  deleteJobApplication
} from "../services/jobApplicationService.js";

// Başvuru ekle
const createJobApplication = async (req, res) => {
  try {
    const applicationData = req.body;
    const jobApp = await addJobApplication(applicationData);
    res.status(201).json({ message: "Başvuru eklendi", job_application: jobApp });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Başvuruları getir (opsiyonel user_id)
const listJobApplications = async (req, res) => {
  try {
    const userId = req.query.user_id || null;
    const jobApps = await getJobApplications(userId);
    res.status(200).json({ job_applications: jobApps });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Başvuru güncelle
const editJobApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await updateJobApplication(id, updateData);
    res.status(200).json({ message: "Başvuru güncellendi", job_application: updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Başvuru sil
const removeJobApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteJobApplication(id);
    res.status(200).json({ message: "Başvuru silindi" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  createJobApplication,
  listJobApplications,
  editJobApplication,
  removeJobApplication
};