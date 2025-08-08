'use client';

import { useState, useEffect } from 'react';
import { getJobApplicationsStats } from '../fetch';
import { 
  ClipboardList, 
  CheckCircle, 
  Building2, 
  CalendarDays 
} from 'lucide-react';

interface JobStats {
  totalApplications: number;
  activeApplications: number;
  companiesCount: number;
  recentApplications: number;
}

export function JobStatsCards() {
  const [stats, setStats] = useState<JobStats>({
    totalApplications: 0,
    activeApplications: 0,
    companiesCount: 0,
    recentApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getJobApplicationsStats();
      setStats(data);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Toplam Başvuru',
      value: stats.totalApplications,
      icon: ClipboardList,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500 dark:text-blue-400',
    },
    {
      title: 'Aktif Başvuru',
      value: stats.activeApplications,
      icon: CheckCircle,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-500 dark:text-green-400',
    },
    {
      title: 'Şirket Sayısı',
      value: stats.companiesCount,
      icon: Building2,
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-500 dark:text-orange-400',
    },
    {
      title: 'Son 7 Gün',
      value: stats.recentApplications,
      icon: CalendarDays,
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-500 dark:text-purple-400',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                 {[...Array(4)].map((_, i) => (
           <div key={i} className="animate-pulse">
             <div className="rounded-2xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-gray-700 dark:bg-gray-800">
               <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
               <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
             </div>
           </div>
         ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
                     <div
             key={index}
             className="rounded-2xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-gray-700 dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300"
           >
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${card.bgColor} ${card.iconColor}`}>
              <IconComponent size={24} />
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {card.value}
                </h4>
                                 <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                   {card.title}
                 </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
