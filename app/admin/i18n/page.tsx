"use client";

import React from "react";
import SoftUIDashboard from "@/components/dashboard/SoftUIDashboard";
import TypographySettings from "@/components/admin/TypographySettings";

export default function I18nPage() {
	return (
		<SoftUIDashboard>
			<div className="space-y-6">
				<TypographySettings />
			</div>
		</SoftUIDashboard>
	);
}
