"use client";

import { Suspense, useEffect, useState } from "react";
import { JobStatsCards } from "./_components/job-stats-cards";
import { JobApplicationsTable } from "./_components/job-applications-table";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Client-side mounting kontrolü
  useEffect(() => {
    setMounted(true);
  }, []);

  // Server-side rendering sırasında loading göster
  if (!mounted || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Hoş Geldiniz!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            İş başvurularınızı takip etmek ve istatistiklerinizi görmek için lütfen giriş yapın.
          </p>
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<div>İstatistikler yükleniyor...</div>}>
        <JobStatsCards />
      </Suspense>

      <div className="mt-4 md:mt-6 2xl:mt-9">
        <Suspense fallback={<div>İş başvuruları yükleniyor...</div>}>
          <JobApplicationsTable />
        </Suspense>
      </div>
    </>
  );
}
