import {supabase} from "../config/supabase.js";

const registerUser = async (full_name, email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
  
    if (error) throw new Error(error.message);
  
    const user = data.user; 
  
    if (!user) throw new Error("User registration failed");
  

    const { error: insertError } = await supabase.from("users").insert([
      { id: user.id, email, full_name },
    ]);
  
    if (insertError) throw new Error(insertError.message);
  
    return user;
  };

const loginUser = async (email, password, rememberMe = false) => {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password,
      options: {
        persistSession: true
      }
    });
  
    if (error) throw new Error(error.message);
  
    if (!data.user) throw new Error("Authentication failed");
  
    return {
      user: data.user,
      session: data.session
    };
};

const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

const checkAdmin = async (userId) => {
  try {

    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data?.role === "admin";
  } catch (error) {
    throw error;
  }
};


const checkAuth = async (token) => {
  if (!token) throw new Error("Token bulunamadı");
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) throw new Error(error.message);
  
  return user;
};

export { registerUser, loginUser, logoutUser, checkAdmin, checkAuth };