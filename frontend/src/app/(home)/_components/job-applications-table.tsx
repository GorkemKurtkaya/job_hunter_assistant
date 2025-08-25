'use client';

import React, { useState, useEffect } from 'react';
import { getJobApplications, updateJobApplication, deleteJobApplication, analyzeJobApplication } from '../fetch';
import { ChevronDown, ChevronRight, Edit, Trash2, BarChart3, X, RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { ConfirmationModal } from './confirmation-modal';

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
  analysis_feedback?: string;
}

export function JobApplicationsTable() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; applicationId: string | null }>({
    isOpen: false,
    applicationId: null
  });
  const [analysisModal, setAnalysisModal] = useState<{ isOpen: boolean; application: JobApplication | null }>({
    isOpen: false,
    application: null
  });

  // Verileri yükle
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await getJobApplications();
      setApplications(data);
    } catch (err) {
      setError('İş başvuruları yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpansion = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleDelete = async (id: string) => {
    const loadingToast = toast.loading('Siliniyor...');

    try {
      await deleteJobApplication(id);
      setApplications(applications.filter(app => app.id !== id));
      toast.success('İş başvurusu başarıyla silindi!', { id: loadingToast });
    } catch (err) {
      toast.error('Silme işlemi başarısız oldu!', { id: loadingToast });
    }
  };

  const openDeleteModal = (applicationId: string) => {
    setDeleteModal({ isOpen: true, applicationId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, applicationId: null });
  };

  const openAnalysisModal = (application: JobApplication) => {
    setAnalysisModal({ isOpen: true, application });
  };

  const closeAnalysisModal = () => {
    setAnalysisModal({ isOpen: false, application: null });
  };

  const confirmDelete = () => {
    if (deleteModal.applicationId) {
      handleDelete(deleteModal.applicationId);
    }
  };

  const closeAllExpandedRows = () => {
    setExpandedRows(new Set());
    toast.success('Tüm detaylar kapatıldı!');
  };

  const handleAnalyze = async (application: JobApplication) => {
    const loadingToast = toast.loading('AI analizi yapılıyor...');

    try {
      const result = await analyzeJobApplication(application.id);
      
      // Başarılı analiz sonrası local state'i güncelle
      setApplications(prev => prev.map(app => 
        app.id === application.id 
          ? { 
              ...app, 
              analysis_percentage: result.percentage,
              analysis_feedback: result.analysis_result 
            }
          : app
      ));

      toast.success(`${application.position} pozisyonu analiz edildi! Uyum: %${result.percentage}`, { id: loadingToast });
    } catch (error) {
      toast.error('Analiz sırasında hata oluştu!', { id: loadingToast });
      console.error('Analiz hatası:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-gray-700 dark:bg-gray-800 sm:px-7.5 xl:pb-1">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-gray-700 dark:bg-gray-800 sm:px-7.5 xl:pb-1">
        <div className="text-red-500 dark:text-red-400 text-center py-4">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            marginTop: '10px',
            zIndex: 99999,
          },
        }}
      />

      <div className="rounded-2xl border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-gray-700 dark:bg-gray-800 sm:px-7.5 xl:pb-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
          <h4 className="text-lg sm:text-xl font-semibold text-black dark:text-white">
            İş Başvurularım
          </h4>
          {expandedRows.size > 0 && (
            <button
              onClick={closeAllExpandedRows}
              className="flex items-center space-x-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 w-full sm:w-auto justify-center"
            >
              <X size={14} className="sm:w-4 sm:h-4" />
              <span>Tümünü Kapat ({expandedRows.size})</span>
            </button>
          )}
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="hidden sm:table-header-group">
              <tr className="bg-gray-2 text-left dark:bg-gray-800">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Şirket & Pozisyon
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Tarih
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Durum
                </th>
                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                  Uyum
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  İşlemler
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <React.Fragment key={application.id}>
                  <tr
                    className="border-b border-[#eee] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                    onClick={() => toggleRowExpansion(application.id)}
                  >
                    <td className="py-4 px-4 pl-9 dark:border-gray-700 xl:pl-11">
                      <div>
                        <h5 className="font-medium text-black dark:text-white text-sm sm:text-base">
                          {application.position}
                        </h5>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{application.company_name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 dark:border-gray-700 hidden sm:table-cell">
                      <p className="text-black dark:text-white text-sm">
                        {formatDate(application.created_at)}
                      </p>
                    </td>
                    <td className="py-4 px-4 dark:border-gray-700 hidden sm:table-cell">
                      <span className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-xs sm:text-sm font-medium bg-green-500 text-green-500 dark:bg-white-400 dark:text-white-400">
                        Aktif
                      </span>
                    </td>
                    <td className="py-4 px-4 dark:border-gray-700">
                      {application.analysis_percentage !== undefined && application.analysis_percentage !== null ? (
                        <div className="flex items-center space-x-2">
                          <span className={`text-base sm:text-lg font-bold ${
                            application.analysis_percentage < 30 
                              ? 'text-red-600 dark:text-red-400' 
                              : application.analysis_percentage < 50 
                              ? 'text-orange-600 dark:text-orange-400'
                              : application.analysis_percentage < 70 
                              ? 'text-yellow-600 dark:text-yellow-500'
                              : application.analysis_percentage < 85 
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-green-600 dark:text-green-400'
                          }`}>
                            %{application.analysis_percentage}
                          </span>
                          {application.analysis_feedback && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openAnalysisModal(application);
                              }}
                              className="p-1.5 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                              title="Analiz Sonucunu Gör"
                            >
                              <BarChart3 size={14} />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAnalyze(application);
                            }}
                            className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                            title="Tekrar Analiz Et"
                          >
                            <RefreshCw size={14} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">Analiz edilmedi</span>
                      )}
                    </td>
                    <td className="py-4 px-4 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        {!application.analysis_percentage ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAnalyze(application);
                            }}
                            className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                          >
                            <BarChart3 size={14} className="sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Analiz Et</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAnalyze(application);
                            }}
                            className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                          >
                            <RefreshCw size={14} className="sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Tekrar Analiz Et</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toast('Düzenleme özelliği yakında eklenecek!');
                          }}
                          className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(application.id);
                          }}
                          className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 dark:border-gray-700">
                      <button
                        className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                        onClick={() => toggleRowExpansion(application.id)}
                      >
                        {expandedRows.has(application.id) ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(application.id) && (
                    <tr>
                      <td colSpan={6} className="px-4 py-3 bg-gray-50 dark:bg-gray-800">
                        <div className="space-y-3">
                          <div>
                            <h6 className="font-medium text-black dark:text-white mb-2 text-sm sm:text-base">
                              İş Açıklaması:
                            </h6>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line max-h-32 sm:max-h-40 overflow-y-auto bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                              {application.description}
                            </div>
                          </div>
                          {application.recruiters && application.recruiters.length > 0 && (
                            <div>
                              <h6 className="font-medium text-black dark:text-white mb-2 text-sm sm:text-base">
                                İşverenler:
                              </h6>
                              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                {application.recruiters.map((recruiter, index) => (
                                  <div key={index} className="mb-1 last:mb-0">
                                    {recruiter}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {applications.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Henüz iş başvurusu bulunmuyor.
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="İş Başvurusunu Sil"
        message="Bu iş başvurusunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        cancelText="İptal"
        type="danger"
      />

      {/* Analysis Result Modal */}
      {analysisModal.isOpen && analysisModal.application && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden mx-4">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white pr-4">
                AI Analiz Sonucu - {analysisModal.application.position}
              </h3>
              <button
                onClick={closeAnalysisModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 flex-shrink-0"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 140px)' }}>
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    %{analysisModal.application.analysis_percentage}
                  </div>
                  <div className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                    Genel Uyum Puanı
                  </div>
                </div>
              </div>
              
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div 
                  className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ 
                    __html: analysisModal.application.analysis_feedback?.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') || '' 
                  }}
                />
              </div>
            </div>
            
            <div className="flex justify-end p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={closeAnalysisModal}
                className="w-full sm:w-auto px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}