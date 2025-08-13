"use client";

import React from "react";
import { COMPANY_STATS, GRID_LAYOUTS } from "@/lib/constants";
import { cn, createOptimizedSection } from "@/lib/component-utils";
import type { CompanyStat } from "@/lib/types";

interface StatItemProps {
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = React.memo(({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-blue-600 mb-2" aria-label={`${value} ${label}`}>
      {value}
    </div>
    <div className="text-gray-600">{label}</div>
  </div>
));

StatItem.displayName = "StatItem";

interface StatsSectionProps {
  className?: string;
}

const StatsSection: React.FC<StatsSectionProps> = ({ className = "" }) => {
  const stats: CompanyStat[] = React.useMemo(() => [
    { value: COMPANY_STATS.experience, label: COMPANY_STATS.experienceLabel },
    { value: COMPANY_STATS.projects, label: COMPANY_STATS.projectsLabel },
    { value: COMPANY_STATS.employees, label: COMPANY_STATS.employeesLabel },
    { value: COMPANY_STATS.satisfaction, label: COMPANY_STATS.satisfactionLabel },
  ], []);

  return (
    <section className={cn("py-16 bg-gray-50", className)} aria-labelledby="stats-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="stats-heading" className="sr-only">إحصائيات الشركة</h2>
        <div className={cn("grid gap-8", GRID_LAYOUTS.stats)}>
          {stats.map((stat, index) => (
            <StatItem key={`${stat.value}-${index}`} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default createOptimizedSection(StatsSection);
