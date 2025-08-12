// Profile API endpoint'leri
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

// TypeScript tipleri
interface Experience {
  id: string;
  user_id: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string;
  achievements: string[];
  created_at: string;
  updated_at: string;
}

interface Education {
  id: string;
  user_id: string;
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  gpa: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface Certification {
  id: string;
  user_id: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string;
  credential_url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  github_url: string;
  linkedin_url: string;
  personal_website: string | null;
  summary: string;
  skills: string[];
  soft_skills: string[];
  created_at: string;
  updated_at: string;
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
}

interface ProfileResponse {
  profile: UserProfile;
}

interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  github_url?: string;
  linkedin_url?: string;
  personal_website?: string;
  summary?: string;
  skills?: string[];
  soft_skills?: string[];
}

// Experience CRUD
interface CreateExperienceData {
  company_name: string;
  position: string;
  start_date: string;
  end_date?: string | null;
  description: string;
  achievements: string[];
}

interface UpdateExperienceData {
  company_name?: string;
  position?: string;
  start_date?: string;
  end_date?: string | null;
  description?: string;
  achievements?: string[];
}

// Education CRUD
interface CreateEducationData {
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  gpa: number;
  description?: string;
}

interface UpdateEducationData {
  institution_name?: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  gpa?: number;
  description?: string;
}

// Certification CRUD
interface CreateCertificationData {
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date?: string | null;
  credential_id: string;
  credential_url: string;
  description: string;
}

interface UpdateCertificationData {
  name?: string;
  issuing_organization?: string;
  issue_date?: string;
  expiry_date?: string | null;
  credential_id?: string;
  credential_url?: string;
  description?: string;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Cookie'leri gönder
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token geçersiz, login sayfasına yönlendir
        window.location.href = '/auth/sign-in';
        return null;
      }
      throw new Error('Profil bilgileri getirilemedi');
    }

    const data: ProfileResponse = await response.json();
    return data.profile;
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    return null;
  }
}

export async function updateUserProfile(updateData: UpdateProfileData): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Cookie'leri gönder
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token geçersiz, login sayfasına yönlendir
        window.location.href = '/auth/sign-in';
        return null;
      }
      throw new Error('Profil güncellenemedi');
    }

    const data: ProfileResponse = await response.json();
    return data.profile;
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    throw error;
  }
}

// Experience CRUD Functions
export async function createExperience(data: CreateExperienceData): Promise<Experience | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/experiences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/auth/sign-in';
        return null;
      }
      throw new Error('İş deneyimi eklenemedi');
    }

    return await response.json();
  } catch (error) {
    console.error('İş deneyimi ekleme hatası:', error);
    throw error;
  }
}

export async function updateExperience(id: string, data: UpdateExperienceData): Promise<Experience | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/experiences/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/auth/sign-in';
        return null;
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `İş deneyimi güncellenemedi (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('İş deneyimi güncelleme hatası:', error);
    throw error;
  }
}

export async function deleteExperience(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/experiences/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/auth/sign-in';
        return false;
      }
      throw new Error('İş deneyimi silinemedi');
    }

    return true;
  } catch (error) {
    console.error('İş deneyimi silme hatası:', error);
    throw error;
  }
}

// Education CRUD Functions
export async function createEducation(data: CreateEducationData): Promise<Education | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/educations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/auth/sign-in';
        return null;
      }
      throw new Error('Eğitim eklenemedi');
    }

    return await response.json();
  } catch (error) {
    console.error('Eğitim ekleme hatası:', error);
    throw error;
  }
}

export async function updateEducation(id: string, data: UpdateEducationData): Promise<Education | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/educations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/auth/sign-in';
        return null;
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Eğitim güncellenemedi (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Eğitim güncelleme hatası:', error);
    throw error;
  }
}

export async function deleteEducation(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/educations/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/auth/sign-in';
        return false;
      }
      throw new Error('Eğitim silinemedi');
    }

    return true;
  } catch (error) {
    console.error('Eğitim silme hatası:', error);
    throw error;
  }
}

// Certification CRUD Functions
export async function createCertification(data: CreateCertificationData): Promise<Certification | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/certifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/auth/sign-in';
        return null;
      }
      throw new Error('Sertifika eklenemedi');
    }

    return await response.json();
  } catch (error) {
    console.error('Sertifika ekleme hatası:', error);
    throw error;
  }
}

export async function updateCertification(id: string, data: UpdateCertificationData): Promise<Certification | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/certifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/auth/sign-in';
        return null;
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Sertifika güncellenemedi (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Sertifika güncelleme hatası:', error);
    throw error;
  }
}

export async function deleteCertification(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/certifications/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/auth/sign-in';
        return false;
      }
      throw new Error('Sertifika silinemedi');
    }

    return true;
  } catch (error) {
    console.error('Sertifika silme hatası:', error);
    throw error;
  }
}
