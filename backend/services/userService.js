import { supabase } from "../config/supabase.js";

// Kullanıcı profilini getir
const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select(`
      *,
      experiences (*),
      educations (*),
      certifications (*)
    `)
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Kullanıcı profilini güncelle
const updateUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from("users")
    .update(profileData)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Sertifika ekle
const addCertification = async (userId, certificationData) => {
  const { data, error } = await supabase
    .from("certifications")
    .insert([{
      user_id: userId,
      ...certificationData
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Sertifika güncelle
const updateCertification = async (certificationId, certificationData) => {
  const { data, error } = await supabase
    .from("certifications")
    .update(certificationData)
    .eq("id", certificationId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Sertifika sil
const deleteCertification = async (certificationId) => {
  const { error } = await supabase
    .from("certifications")
    .delete()
    .eq("id", certificationId);

  if (error) throw new Error(error.message);
  return { success: true };
};

// Eğitim ekle
const addEducation = async (userId, educationData) => {
  const { data, error } = await supabase
    .from("educations")
    .insert([{
      user_id: userId,
      ...educationData
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Eğitim güncelle
const updateEducation = async (educationId, educationData) => {
  const { data, error } = await supabase
    .from("educations")
    .update(educationData)
    .eq("id", educationId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Eğitim sil
const deleteEducation = async (educationId) => {
  const { error } = await supabase
    .from("educations")
    .delete()
    .eq("id", educationId);

  if (error) throw new Error(error.message);
  return { success: true };
};

// İş deneyimi ekle
const addExperience = async (userId, experienceData) => {
  const { data, error } = await supabase
    .from("experiences")
    .insert([{
      user_id: userId,
      ...experienceData
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// İş deneyimi güncelle
const updateExperience = async (experienceId, experienceData) => {
  const { data, error } = await supabase
    .from("experiences")
    .update(experienceData)
    .eq("id", experienceId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// İş deneyimi sil
const deleteExperience = async (experienceId) => {
  const { error } = await supabase
    .from("experiences")
    .delete()
    .eq("id", experienceId);

  if (error) throw new Error(error.message);
  return { success: true };
};

export {
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
}; 