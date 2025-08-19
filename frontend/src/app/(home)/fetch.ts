const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';


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
  analysis_percentage?: number; 
}


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
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
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
      credentials: 'include', 
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
      credentials: 'include', 
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

async function getUserIdFromCookie(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-auth`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.user?.id || null;
    }
    return null;
  } catch (error) {
    console.error('UserId alma hatası:', error);
    return null;
  }
}


export async function analyzeJobApplication(jobId: string): Promise<AIAnalysisResponse> {
  try {
    const userId = await getUserIdFromCookie();
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