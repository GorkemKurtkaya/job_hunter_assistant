const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Auth token'larını localStorage'dan al
const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

// Auth token'larını localStorage'a kaydet
const storeTokens = (accessToken: string, refreshToken?: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
};

// Auth token'larını localStorage'dan temizle
const clearTokens = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Authorization header'ı oluştur
const getAuthHeaders = () => {
  const token = getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Kullanıcı kaydı
export const registerUser = async (userData: {
  full_name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Kayıt işlemi başarısız');
    }

    return await response.json();
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

// Kullanıcı girişi
export const loginUser = async (credentials: {
  email: string;
  password: string;
  rememberMe: boolean;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Giriş başarısız');
    }

    const userData = await response.json();
    
    // Token'ları localStorage'a kaydet
    if (userData.session?.access_token) {
      storeTokens(
        userData.session.access_token,
        userData.session.refresh_token
      );
    }

    return userData;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Kullanıcı çıkışı
export const logoutUser = async () => {
  try {
    const token = getStoredToken();
    
    if (token) {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Her durumda token'ları temizle
    clearTokens();
  }
};

// Kullanıcı oturum kontrolü
export const checkUserAuth = async () => {
  try {
    const token = getStoredToken();
    
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/check-auth`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Check auth error:', error);
    clearTokens();
    return null;
  }
};

// Admin kontrolü
export const checkAdminStatus = async () => {
  try {
    const token = getStoredToken();
    
    if (!token) {
      return { isAdmin: false };
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/check-admin`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      return { isAdmin: false };
    }

    return await response.json();
  } catch (error) {
    console.error('Check admin error:', error);
    return { isAdmin: false };
  }
};

// Token yenileme (refresh token ile)
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('Refresh token bulunamadı');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token yenilenemedi');
    }

    const data = await response.json();
    
    if (data.access_token) {
      storeTokens(data.access_token, data.refresh_token);
      return data.access_token;
    }

    throw new Error('Yeni token alınamadı');
  } catch (error) {
    console.error('Refresh token error:', error);
    clearTokens();
    throw error;
  }
};

// Auth durumunu kontrol et ve gerekirse token yenile
export const ensureValidToken = async () => {
  try {
    const user = await checkUserAuth();
    
    if (user) {
      return user;
    }

    // Token yoksa veya geçersizse, refresh token ile yenilemeyi dene
    try {
      await refreshAccessToken();
      return await checkUserAuth();
    } catch (refreshError) {
      // Refresh de başarısızsa null döndür
      return null;
    }
  } catch (error) {
    console.error('Ensure valid token error:', error);
    return null;
  }
};

// Kullanıcı profil bilgilerini getir
export const getUserProfile = async () => {
  try {
    const token = getStoredToken();
    
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearTokens();
        return null;
      }
      throw new Error('Profil bilgileri getirilemedi');
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
};
