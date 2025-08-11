import { supabase } from "../config/supabase.js";

// Başvuru ekle
const addJobApplication = async (applicationData) => {
  const { data, error } = await supabase
    .from("job_applications")
    .insert([applicationData])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// Başvuruları getir (user_id ile veya hepsi)
const getJobApplications = async (userId = null) => {
  let query = supabase.from("job_applications").select("*").order("created_at", { ascending: false });
  if (userId) query = query.eq("user_id", userId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

const getJobApplication = async (id) => {
  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// Başvuru güncelle
const updateJobApplication = async (id, updateData) => {
  const { data, error } = await supabase
    .from("job_applications")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// Başvuru sil
const deleteJobApplication = async (id) => {
  const { error } = await supabase
    .from("job_applications")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
};

export {
  addJobApplication,
  getJobApplications,
  updateJobApplication,
  deleteJobApplication,
  getJobApplication
};