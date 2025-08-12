"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState, useEffect, useCallback } from "react";
import { CameraIcon, Mail, Phone, Globe, MapPin, Calendar, Award, GraduationCap, Briefcase, ExternalLink, Edit, X, Plus, Trash2, Save } from "lucide-react";
import { SocialAccounts } from "./_components/social-accounts";
import { 
  getUserProfile, 
  updateUserProfile, 
  createExperience, 
  updateExperience, 
  deleteExperience,
  createEducation,
  updateEducation,
  deleteEducation,
  createCertification,
  updateCertification,
  deleteCertification
} from "./fetch";
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

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
  experiences: any[];
  educations: any[];
  certifications: any[];
}

export default function Page() {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    github_url: '',
    linkedin_url: '',
    personal_website: '',
    summary: '',
    skills: [] as string[],
    soft_skills: [] as string[],
  });
  
  // Input değerleri için ayrı state'ler
  const [skillsInput, setSkillsInput] = useState('');
  const [softSkillsInput, setSoftSkillsInput] = useState('');
  const [updating, setUpdating] = useState(false);
  
  // Experience states
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [experienceForm, setExperienceForm] = useState({
    company_name: '',
    position: '',
    start_date: '',
    end_date: '',
    description: '',
    achievements: [] as string[],
  });
  
  // Education states
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [educationForm, setEducationForm] = useState({
    institution_name: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    gpa: 0,
    description: '',
  });
  
  // Certification states
  const [isAddingCertification, setIsAddingCertification] = useState(false);
  const [editingCertificationId, setEditingCertificationId] = useState<string | null>(null);
  const [certificationForm, setCertificationForm] = useState({
    name: '',
    issuing_organization: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
    description: '',
  });

  // Client-side mounting kontrolü
  useEffect(() => {
    setMounted(true);
  }, []);

  // Authentication kontrolü
  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/auth/sign-in');
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      if (data) {
        setProfile(data);
        // Edit form'u da güncelle
        setEditForm({
          full_name: data.full_name,
          phone: data.phone,
          github_url: data.github_url,
          linkedin_url: data.linkedin_url,
          personal_website: data.personal_website || '',
          summary: data.summary,
          skills: [...data.skills],
          soft_skills: [...data.soft_skills],
        });
        // Input state'lerini de doldur
        setSkillsInput(data.skills.join(', '));
        setSoftSkillsInput(data.soft_skills.join(', '));
      } else {
        setError('Profil yüklenemedi');
      }
    } catch (err) {
      setError('Profil yüklenirken hata oluştu');
      toast.error('Profil yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      loadProfile();
    }
  }, [mounted, isAuthenticated, loadProfile]);

  // Server-side rendering sırasında loading göster
  if (!mounted || !isInitialized) {
    return (
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-t-[10px]"></div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-b-[10px]">
            <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto -mt-16"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mt-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mt-2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Loading durumu
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-t-[10px]"></div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-b-[10px]">
            <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto -mt-16"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mt-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mt-2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Giriş yapılmamışsa loading göster
  if (!isAuthenticated) {
    return (
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />
        <div className="bg-white dark:bg-gray-800 rounded-[10px] p-6 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yönlendiriliyor...</p>
        </div>
      </div>
    );
  }

  // Loading durumu - profil yüklenirken
  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-t-[10px]"></div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-b-[10px]">
            <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto -mt-16"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mt-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mt-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mt-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mt-2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Sadece gerçek hata durumunda error göster
  if (error && !loading) {
    return (
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />
        <div className="bg-white dark:bg-gray-800 rounded-[10px] p-6 text-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  // Profil yoksa loading göster (henüz yüklenmemiş olabilir)
  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-t-[10px]"></div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-b-[10px]">
            <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto -mt-16"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mt-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mt-2"></div>
          </div>
        </div>
      </div>
    );
  }



  // CRUD işlemlerinden sonra sayfa yenileme fonksiyonu
  const refreshProfile = async () => {
    try {
      const data = await getUserProfile();
      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Profil yenileme hatası:', err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updatedProfile = await updateUserProfile(editForm);
      if (updatedProfile) {
        setIsEditing(false);
        toast.success('Profil bilgileri başarıyla güncellendi!', {
          duration: 4000,
          position: 'bottom-right',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        await refreshProfile(); // Sayfa yenile
      }
    } catch (err) {
      toast.error('Profil güncellenirken hata oluştu', {
        duration: 4000,
        position: 'bottom-right',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (field: 'skills' | 'soft_skills', value: string) => {
    // Input değerini güncelle
    if (field === 'skills') {
      setSkillsInput(value);
    } else {
      setSoftSkillsInput(value);
    }
    
    // Array'i de güncelle
    setEditForm(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Profile" />

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            zIndex: 99999,
          },
        }}
      />

      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-800 dark:shadow-card">
        {/* Cover Photo */}
        <div className="relative z-20 h-35 md:h-65 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            <label
              htmlFor="cover"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-white/20 backdrop-blur px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-white/30 transition-colors"
            >
              <CameraIcon size={16} />
              <span>Edit</span>
            </label>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          {/* Profile Photo */}
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                {profile.full_name.split(' ').map(n => n[0]).join('')}
              </div>
                  <label
                    htmlFor="profilePhoto"
                    className="absolute bottom-0 right-0 flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                  >
                <CameraIcon size={16} />
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="mt-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h3 className="text-heading-6 font-bold text-dark dark:text-white">
                {profile.full_name}
              </h3>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Edit size={16} />
                Düzenle
              </button>
            </div>
            <p className="font-medium text-gray-600 dark:text-gray-400">Full Stack Developer</p>

            {/* Contact Info */}
            <div className="mx-auto mb-5.5 mt-5 max-w-[370px]">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700">
                    <Mail size={16} className="text-gray-500 dark:text-gray-400" />
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-400 border-none outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700">
                    <Phone size={16} className="text-gray-500 dark:text-gray-400" />
                    <input
                      type="text"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleInputChange}
                      className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-400 border-none outline-none"
                      placeholder="Telefon numarası"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 rounded-[5px] border border-stroke py-[9px] shadow-1 dark:border-gray-700 dark:bg-gray-900 dark:shadow-card">
                  <div className="flex items-center justify-center gap-2 px-4">
                    <Mail size={16} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{profile.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 px-4">
                    <Phone size={16} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{profile.phone}</span>
                  </div>
                </div>
              )}
            </div>

            {/* About Me */}
            <div className="mx-auto max-w-[720px] mb-8">
              <h4 className="font-medium text-dark dark:text-white mb-4">
                Hakkımda
              </h4>
              {isEditing ? (
                <textarea
                  name="summary"
                  value={editForm.summary}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {profile.summary}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="mx-auto max-w-[720px] mb-8">
              <h4 className="font-medium text-dark dark:text-white mb-4">
                Teknik Yetenekler
              </h4>
              {isEditing ? (
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => handleArrayInputChange('skills', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="JavaScript, React, Node.js"
                />
              ) : (
                <div className="flex flex-wrap gap-2 justify-center">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
          </div>

            {/* Soft Skills */}
            <div className="mx-auto max-w-[720px] mb-8">
              <h4 className="font-medium text-dark dark:text-white mb-4">
                Kişisel Yetenekler
              </h4>
              {isEditing ? (
                <input
                  type="text"
                  value={softSkillsInput}
                  onChange={(e) => handleArrayInputChange('soft_skills', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="İletişim, Takım Çalışması"
                />
              ) : (
                <div className="flex flex-wrap gap-2 justify-center">
                  {profile.soft_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                    >
                      {skill}
                </span>
                  ))}
                </div>
              )}
            </div>

            {/* Onayla Butonu */}
            {isEditing && (
              <div className="mx-auto max-w-[720px] mb-6">
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleEditSubmit}
                    disabled={updating}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
                  >
                    <Save size={16} />
                    {updating ? 'Güncelleniyor...' : 'Onayla'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      // Input state'lerini temizle
                      setSkillsInput('');
                      setSoftSkillsInput('');
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                  >
                    <X size={16} />
                    İptal
                  </button>
                </div>
              </div>
            )}

            {/* Experience */}
            <div className="mx-auto max-w-[720px] mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-dark dark:text-white flex items-center gap-2">
                  <Briefcase size={20} />
                  İş Deneyimi
                </h4>
                <button
                  onClick={() => setIsAddingExperience(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus size={16} />
                  Ekle
                </button>
              </div>
              
                             {/* Add/Edit Experience Form */}
               {(isAddingExperience || editingExperienceId) && (
                 <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                   <h5 className="font-medium text-dark dark:text-white mb-3">
                     {editingExperienceId ? 'İş Deneyimi Düzenle' : 'Yeni İş Deneyimi Ekle'}
                   </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Şirket Adı"
                      value={experienceForm.company_name}
                      onChange={(e) => setExperienceForm(prev => ({ ...prev, company_name: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Pozisyon"
                      value={experienceForm.position}
                      onChange={(e) => setExperienceForm(prev => ({ ...prev, position: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="date"
                      placeholder="Başlangıç Tarihi"
                      value={experienceForm.start_date}
                      onChange={(e) => setExperienceForm(prev => ({ ...prev, start_date: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="date"
                      placeholder="Bitiş Tarihi"
                      value={experienceForm.end_date}
                      onChange={(e) => setExperienceForm(prev => ({ ...prev, end_date: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <textarea
                    placeholder="Açıklama"
                    value={experienceForm.description}
                    onChange={(e) => setExperienceForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full mt-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Başarılar (virgülle ayırın)"
                    value={experienceForm.achievements.join(', ')}
                    onChange={(e) => setExperienceForm(prev => ({ 
                      ...prev, 
                      achievements: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                    }))}
                    className="w-full mt-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={async () => {
                        try {
                          // end_date boşsa null yap
                          const formData = {
                            ...experienceForm,
                            end_date: experienceForm.end_date || null
                          };

                                                      if (editingExperienceId) {
                              // Update existing experience
                              const updatedExp = await updateExperience(editingExperienceId, formData);
                              if (updatedExp) {
                                setExperienceForm({ company_name: '', position: '', start_date: '', end_date: '', description: '', achievements: [] });
                                setEditingExperienceId(null);
                                toast.success('İş deneyimi başarıyla güncellendi!', {
                                  duration: 4000,
                                  position: 'bottom-right',
                                  style: {
                                    background: '#3B82F6',
                                    color: '#fff',
                                  },
                                });
                                await refreshProfile(); // Sayfa yenile
                              }
                            } else {
                              // Create new experience
                              const newExp = await createExperience(formData);
                              if (newExp) {
                                setExperienceForm({ company_name: '', position: '', start_date: '', end_date: '', description: '', achievements: [] });
                                setIsAddingExperience(false);
                                toast.success('İş deneyimi başarıyla eklendi!', {
                                  duration: 4000,
                                  position: 'bottom-right',
                                  style: {
                                    background: '#10B981',
                                    color: '#fff',
                                  },
                                });
                                await refreshProfile(); // Sayfa yenile
                              }
                            }
                        } catch (err) {
                          toast.error(editingExperienceId ? 'İş deneyimi güncellenirken hata oluştu' : 'İş deneyimi eklenirken hata oluştu');
                        }
                      }}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {editingExperienceId ? 'Güncelle' : 'Kaydet'}
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingExperience(false);
                        setEditingExperienceId(null);
                        setExperienceForm({ company_name: '', position: '', start_date: '', end_date: '', description: '', achievements: [] });
                      }}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {profile.experiences && profile.experiences.length > 0 && profile.experiences
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((exp, index) => (
                  <div key={exp.id || `exp-${index}`} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-left">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-dark dark:text-white">{exp.position}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Devam Ediyor'}
                </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingExperienceId(exp.id);
                              setExperienceForm({
                                company_name: exp.company_name,
                                position: exp.position,
                                start_date: exp.start_date,
                                end_date: exp.end_date || '',
                                description: exp.description,
                                achievements: exp.achievements || [],
                              });
                            }}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit size={16} />
                          </button>
                                                    <button
                            onClick={async () => {
                              const result = await Swal.fire({
                                title: 'Emin misiniz?',
                                text: 'Bu iş deneyimini silmek istediğinizden emin misiniz?',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#d33',
                                cancelButtonColor: '#3085d6',
                                confirmButtonText: 'Evet, sil!',
                                cancelButtonText: 'İptal'
                              });

                              if (result.isConfirmed) {
                                try {
                                  const success = await deleteExperience(exp.id);
                                  if (success) {
                                    toast.success('İş deneyimi başarıyla silindi!', {
                                      duration: 4000,
                                      position: 'bottom-right',
                                      style: {
                                        background: '#EF4444',
                                        color: '#fff',
                                      },
                                    });
                                    await refreshProfile(); // Sayfa yenile
                                  }
                                } catch (err) {
                                  toast.error('İş deneyimi silinirken hata oluştu');
                                }
                              }
                            }}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{exp.company_name}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{exp.description}</p>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                        {exp.achievements.map((achievement: string, index: number) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mx-auto max-w-[720px] mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-dark dark:text-white flex items-center gap-2">
                  <GraduationCap size={20} />
                  Eğitim
                </h4>
                <button
                  onClick={() => setIsAddingEducation(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus size={16} />
                  Ekle
                </button>
              </div>
              
              {/* Add/Edit Education Form */}
              {(isAddingEducation || editingEducationId) && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                  <h5 className="font-medium text-dark dark:text-white mb-3">
                    {editingEducationId ? 'Eğitim Düzenle' : 'Yeni Eğitim Ekle'}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Kurum Adı"
                      value={educationForm.institution_name}
                      onChange={(e) => setEducationForm(prev => ({ ...prev, institution_name: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Derece (Lisans, Yüksek Lisans, vb.)"
                      value={educationForm.degree}
                      onChange={(e) => setEducationForm(prev => ({ ...prev, degree: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Bölüm/Alan"
                      value={educationForm.field_of_study}
                      onChange={(e) => setEducationForm(prev => ({ ...prev, field_of_study: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      placeholder="GPA"
                      value={educationForm.gpa}
                      onChange={(e) => setEducationForm(prev => ({ ...prev, gpa: parseFloat(e.target.value) || 0 }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="date"
                      placeholder="Başlangıç Tarihi"
                      value={educationForm.start_date}
                      onChange={(e) => setEducationForm(prev => ({ ...prev, start_date: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="date"
                      placeholder="Bitiş Tarihi"
                      value={educationForm.end_date}
                      onChange={(e) => setEducationForm(prev => ({ ...prev, end_date: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <textarea
                    placeholder="Açıklama (opsiyonel)"
                    value={educationForm.description}
                    onChange={(e) => setEducationForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full mt-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={async () => {
                        try {
                          if (editingEducationId) {
                            // Update existing education
                            const updatedEdu = await updateEducation(editingEducationId, educationForm);
                            if (updatedEdu) {
                              setEducationForm({ institution_name: '', degree: '', field_of_study: '', start_date: '', end_date: '', gpa: 0, description: '' });
                              setEditingEducationId(null);
                              toast.success('Eğitim başarıyla güncellendi!', {
                                duration: 4000,
                                position: 'bottom-right',
                                style: {
                                  background: '#8B5CF6',
                                  color: '#fff',
                                },
                              });
                              await refreshProfile(); // Sayfa yenile
                            }
                          } else {
                            // Create new education
                            const newEdu = await createEducation(educationForm);
                            if (newEdu) {
                              setEducationForm({ institution_name: '', degree: '', field_of_study: '', start_date: '', end_date: '', gpa: 0, description: '' });
                              setIsAddingEducation(false);
                              toast.success('Eğitim başarıyla eklendi!', {
                                duration: 4000,
                                position: 'bottom-right',
                                style: {
                                  background: '#10B981',
                                  color: '#fff',
                                },
                              });
                              await refreshProfile(); // Sayfa yenile
                            }
                          }
                        } catch (err) {
                          toast.error(editingEducationId ? 'Eğitim güncellenirken hata oluştu' : 'Eğitim eklenirken hata oluştu');
                        }
                      }}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {editingEducationId ? 'Güncelle' : 'Kaydet'}
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingEducation(false);
                        setEditingEducationId(null);
                        setEducationForm({ institution_name: '', degree: '', field_of_study: '', start_date: '', end_date: '', gpa: 0, description: '' });
                      }}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {profile.educations && profile.educations.length > 0 && profile.educations
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((edu, index) => (
                  <div key={edu.id || `edu-${index}`} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-left">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-dark dark:text-white">{edu.degree} - {edu.field_of_study}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingEducationId(edu.id);
                              setEducationForm({
                                institution_name: edu.institution_name,
                                degree: edu.degree,
                                field_of_study: edu.field_of_study,
                                start_date: edu.start_date,
                                end_date: edu.end_date,
                                gpa: edu.gpa,
                                description: edu.description || '',
                              });
                            }}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={async () => {
                              const result = await Swal.fire({
                                title: 'Emin misiniz?',
                                text: 'Bu eğitimi silmek istediğinizden emin misiniz?',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#d33',
                                cancelButtonColor: '#3085d6',
                                confirmButtonText: 'Evet, sil!',
                                cancelButtonText: 'İptal'
                              });

                              if (result.isConfirmed) {
                                try {
                                  const success = await deleteEducation(edu.id);
                                  if (success) {
                                    toast.success('Eğitim başarıyla silindi!', {
                                      duration: 4000,
                                      position: 'bottom-right',
                                      style: {
                                        background: '#EF4444',
                                        color: '#fff',
                                      },
                                    });
                                    await refreshProfile(); // Sayfa yenile
                                  }
                                } catch (err) {
                                  toast.error('Eğitim silinirken hata oluştu');
                                }
                              }
                            }}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{edu.institution_name}</p>
                    {edu.gpa && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm">GPA: {edu.gpa}</p>
                    )}
                    {edu.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="mx-auto max-w-[720px] mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-dark dark:text-white flex items-center gap-2">
                  <Award size={20} />
                  Sertifikalar
              </h4>
                <button
                  onClick={() => setIsAddingCertification(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus size={16} />
                  Ekle
                </button>
              </div>
              
              {/* Add/Edit Certification Form */}
              {(isAddingCertification || editingCertificationId) && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                  <h5 className="font-medium text-dark dark:text-white mb-3">
                    {editingCertificationId ? 'Sertifika Düzenle' : 'Yeni Sertifika Ekle'}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Sertifika Adı"
                      value={certificationForm.name}
                      onChange={(e) => setCertificationForm(prev => ({ ...prev, name: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Veren Kurum"
                      value={certificationForm.issuing_organization}
                      onChange={(e) => setCertificationForm(prev => ({ ...prev, issuing_organization: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="date"
                      placeholder="Verilme Tarihi"
                      value={certificationForm.issue_date}
                      onChange={(e) => setCertificationForm(prev => ({ ...prev, issue_date: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="date"
                      placeholder="Geçerlilik Tarihi (opsiyonel)"
                      value={certificationForm.expiry_date}
                      onChange={(e) => setCertificationForm(prev => ({ ...prev, expiry_date: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Sertifika ID"
                      value={certificationForm.credential_id}
                      onChange={(e) => setCertificationForm(prev => ({ ...prev, credential_id: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="url"
                      placeholder="Sertifika URL"
                      value={certificationForm.credential_url}
                      onChange={(e) => setCertificationForm(prev => ({ ...prev, credential_url: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <textarea
                    placeholder="Açıklama"
                    value={certificationForm.description}
                    onChange={(e) => setCertificationForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full mt-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                                                  onClick={async () => {
                              try {
                                // expiry_date boşsa null yap
                                const formData = {
                                  ...certificationForm,
                                  expiry_date: certificationForm.expiry_date || null
                                };

                                if (editingCertificationId) {
                                  // Update existing certification
                                  const updatedCert = await updateCertification(editingCertificationId, formData);
                                  if (updatedCert) {
                                    setCertificationForm({ name: '', issuing_organization: '', issue_date: '', expiry_date: '', credential_id: '', credential_url: '', description: '' });
                                    setEditingCertificationId(null);
                                    toast.success('Sertifika başarıyla güncellendi!', {
                                      duration: 4000,
                                      position: 'bottom-right',
                                      style: {
                                        background: '#F59E0B',
                                        color: '#fff',
                                      },
                                    });
                                    await refreshProfile(); // Sayfa yenile
                                  }
                                } else {
                                  // Create new certification
                                  const newCert = await createCertification(formData);
                                  if (newCert) {
                                    setCertificationForm({ name: '', issuing_organization: '', issue_date: '', expiry_date: '', credential_id: '', credential_url: '', description: '' });
                                    setIsAddingCertification(false);
                                    toast.success('Sertifika başarıyla eklendi!', {
                                      duration: 4000,
                                      position: 'bottom-right',
                                      style: {
                                        background: '#10B981',
                                        color: '#fff',
                                      },
                                    });
                                    await refreshProfile(); // Sayfa yenile
                                  }
                                }
                              } catch (err) {
                                toast.error(editingCertificationId ? 'Sertifika güncellenirken hata oluştu' : 'Sertifika eklenirken hata oluştu');
                              }
                            }}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {editingCertificationId ? 'Güncelle' : 'Kaydet'}
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingCertification(false);
                        setEditingCertificationId(null);
                        setCertificationForm({ name: '', issuing_organization: '', issue_date: '', expiry_date: '', credential_id: '', credential_url: '', description: '' });
                      }}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {profile.certifications && profile.certifications.length > 0 && profile.certifications
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((cert, index) => (
                  <div key={cert.id || `cert-${index}`} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-left">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-dark dark:text-white">{cert.name}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(cert.issue_date)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCertificationId(cert.id);
                              setCertificationForm({
                                name: cert.name,
                                issuing_organization: cert.issuing_organization,
                                issue_date: cert.issue_date,
                                expiry_date: cert.expiry_date || '',
                                credential_id: cert.credential_id,
                                credential_url: cert.credential_url,
                                description: cert.description,
                              });
                            }}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={async () => {
                              const result = await Swal.fire({
                                title: 'Emin misiniz?',
                                text: 'Bu sertifikayı silmek istediğinizden emin misiniz?',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#d33',
                                cancelButtonColor: '#3085d6',
                                confirmButtonText: 'Evet, sil!',
                                cancelButtonText: 'İptal'
                              });

                              if (result.isConfirmed) {
                                try {
                                  const success = await deleteCertification(cert.id);
                                  if (success) {
                                    toast.success('Sertifika başarıyla silindi!', {
                                      duration: 4000,
                                      position: 'bottom-right',
                                      style: {
                                        background: '#EF4444',
                                        color: '#fff',
                                      },
                                    });
                                    await refreshProfile(); // Sayfa yenile
                                  }
                                } catch (err) {
                                  toast.error('Sertifika silinirken hata oluştu');
                                }
                              }
                            }}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{cert.issuing_organization}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{cert.description}</p>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        Sertifikayı Görüntüle <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Accounts */}
            <SocialAccounts 
              githubUrl={profile.github_url}
              linkedinUrl={profile.linkedin_url}
              personalWebsite={profile.personal_website}
            />
          </div>
        </div>
      </div>


    </div>
  );
}
