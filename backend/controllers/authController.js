import { registerUser, loginUser, logoutUser, checkAuth } from "../services/authService.js";

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
      const { email, password } = req.body;
      const { user, session } = await loginUser(email, password);
      
      
      res.cookie('token', session.access_token, {
        httpOnly: true, 
        sameSite: 'None', 
        maxAge: 24 * 60 * 60 * 1000,
        secure: true 
      });

      res.cookie('userId', user.id, {
        sameSite: 'None', 
        maxAge: 24 * 60 * 60 * 1000,
        secure: true 
      });

      res.status(200).json({ 
        message: "Giriş başarılı",
        user: {
          id: user.id,
          email: user.email
        }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

const logout = async (req, res) => {
  try {
    await logoutUser();
    
    
    res.clearCookie('token');
    res.clearCookie('userId');
    res.status(200).json({ message: "Çıkış başarılı" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkAdmin = async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: "Oturum bulunamadı" });
    }

    const user = await checkAuth(token);
    
    if (!user) {
      return res.status(403).json({ isAdmin: false });
    }

    res.status(200).json({ isAdmin: true });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Oturum kontrolü
const checkUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: "Oturum bulunamadı" });
    }

    const user = await checkAuth(token);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Check user error:', error);

    if (error.message.includes("token") || error.message.includes("session")) {
      res.clearCookie('token');
      res.clearCookie('userId');
    }
    res.status(401).json({ error: error.message });
  }
};

export { register, login, logout, checkAdmin, checkUser };
