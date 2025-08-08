import { Suspense } from "react";
import { JobStatsCards } from "./_components/job-stats-cards";
import { JobApplicationsTable } from "./_components/job-applications-table";

export default async function Home() {
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
