"use client";

import dynamic from "next/dynamic";

const SoftUIDashboard = dynamic(() => import("../../components/dashboard/SoftUIDashboard"), {
  ssr: false,
  loading: () => <div className="min-h-[50vh] animate-pulse bg-gray-100" />,
});

const SoftUICharts = dynamic(() => import("../../components/dashboard/SoftUICharts"), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-xl" />,
});

export default function AdminPage() {
  return (
    <SoftUIDashboard>
      <div className="mt-8">
        <SoftUICharts />
      </div>
    </SoftUIDashboard>
  );
}
