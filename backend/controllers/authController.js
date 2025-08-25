import { registerUser, loginUser, logoutUser, checkAuth, checkAdminService } from "../services/authService.js";

const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    const user = await registerUser(full_name, email, password);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
    try {
      const { email, password, rememberMe } = req.body;
      const { user, session } = await loginUser(email, password, rememberMe);
      
      // Supabase session'ı client'a gönder
      res.status(200).json({ 
        message: "Giriş başarılı",
        user: {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.full_name
        },
        session: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at
        },
        rememberMe: rememberMe || false
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

const logout = async (req, res) => {
  try {
    await logoutUser();
    res.status(200).json({ message: "Çıkış başarılı" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: "Token bulunamadı" });
    }

    const user = await checkAuth(token);
    
    if (!user) {
      return res.status(403).json({ isAdmin: false });
    }

    // Admin kontrolü için service'den checkAdmin çağır
    const isAdmin = await checkAdminService(user.id);
    res.status(200).json({ isAdmin });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Oturum kontrolü
const checkUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: "Token bulunamadı" });
    }

    const user = await checkAuth(token);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Check user error:', error);
    res.status(401).json({ error: error.message });
  }
};

// Test endpoint'i - token debug için
const debugToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.headers.authorization?.replace('Bearer ', '');
      
    res.status(200).json({ 
      authHeader,
      token: token ? 'Token var' : 'Token yok',
      allHeaders: req.headers
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Token yenileme
const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({ error: "Refresh token gerekli" });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refresh_token
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { register, login, logout, checkAdmin, checkUser, debugToken, refreshToken };
