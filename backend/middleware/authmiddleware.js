import { checkAdmin } from "../services/authService.js";
import {supabase} from "../config/supabase.js";

// Token kontrolü için middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: "Token bulunamadı" });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Geçersiz token" });
    }

    req.userId = user.id;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Kimlik doğrulama hatası" });
  }
};

const adminGuard = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: "Token bulunamadı"
      });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Geçersiz token" });
    }

    const isAdmin = await checkAdmin(user.id);
    console.log('Admin Check - UserId:', user.id, 'Is Admin:', isAdmin);
    
    if (!isAdmin) {
      return res.status(403).json({ error: "Bu işlem için admin yetkisi gerekiyor" });
    }
    req.userId = user.id;
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin Guard Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export { authMiddleware, adminGuard }; 