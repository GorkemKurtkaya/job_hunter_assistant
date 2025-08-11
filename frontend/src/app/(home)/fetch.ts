// İş başvuruları API endpoint'leri
const API_BASE_URL = 'http://localhost:8000/api';

// TypeScript tipleri
interface JobApplication {
  id: string;
  user_id: string | null;
  company_name: string;
  position: string;
  description: string;
  recruiters: string[];
  created_at: string;
  updated_at: string;
  status?: string;
  analysis_percentage?: number; // Yeni column
}

// AI analiz için interface
interface AIAnalysisResponse {
  success: boolean;
  percentage: number;
  analysis_result: string;
  message: string;
}

export async function getJobApplications(): Promise<JobApplication[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/job-applications`, {
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
        return [];
      }
      throw new Error('İş başvuruları getirilemedi');
    }

    const data = await response.json();
    return data.job_applications || [];
  } catch (error) {
    console.error('İş başvuruları getirme hatası:', error);
    return [];
  }
}

export async function updateJobApplication(id: string, updateData: Partial<JobApplication>) {
  try {
    const response = await fetch(`${API_BASE_URL}/job-applications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Cookie'leri gönder
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/auth/sign-in';
        return;
      }
      throw new Error('İş başvurusu güncellenemedi');
    }

    return await response.json();
  } catch (error) {
    console.error('İş başvurusu güncelleme hatası:', error);
    throw error;
  }
}

export async function deleteJobApplication(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/job-applications/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Cookie'leri gönder
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/auth/sign-in';
        return false;
      }
      throw new Error('İş başvurusu silinemedi');
    }

    return true;
  } catch (error) {
    console.error('İş başvurusu silme hatası:', error);
    throw error;
  }
}

// İstatistikler için özet veri
export async function getJobApplicationsStats() {
  try {
    const applications = await getJobApplications();
    
    return {
      totalApplications: applications.length,
      activeApplications: applications.filter((app: JobApplication) => app.status !== 'rejected').length,
      companiesCount: new Set(applications.map((app: JobApplication) => app.company_name)).size,
      recentApplications: applications.filter((app: JobApplication) => {
        const createdDate = new Date(app.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdDate > weekAgo;
      }).length,
    };
  } catch (error) {
    console.error('İstatistik hesaplama hatası:', error);
    return {
      totalApplications: 0,
      activeApplications: 0,
      companiesCount: 0,
      recentApplications: 0,
    };
  }
}

// Cookie'den userId çek
function getUserIdFromCookie(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'userId') {
      return value;
    }
  }
  return null;
}

// AI analiz fonksiyonu
export async function analyzeJobApplication(jobId: string): Promise<AIAnalysisResponse> {
  try {
    const userId = getUserIdFromCookie();
    if (!userId) {
      throw new Error('Kullanıcı ID bulunamadı');
    }

    const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId, jobId }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/auth/sign-in';
        throw new Error('Oturum süresi doldu');
      }
      throw new Error('AI analizi yapılamadı');
    }

    return await response.json();
  } catch (error) {
    console.error('AI analiz hatası:', error);
    throw error;
  }
}