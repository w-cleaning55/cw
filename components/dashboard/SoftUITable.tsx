"use client";

import React from "react";
import { Search, Filter, Download, Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import SoftUICard from "./SoftUICard";
import SoftUIButton from "./SoftUIButton";

interface SoftUITableProps {
	title: string;
	data: any[];
	columns: Array<{
		key: string;
		label: string;
		render?: (value: any, row: any) => React.ReactNode;
	}>;
	className?: string;
	loading?: boolean;
}

const SoftUITable: React.FC<SoftUITableProps> = ({ 
	title, 
	data, 
	columns, 
	className = "",
	loading = false,
}) => {
	return (
		<SoftUICard variant="glass" className={className}>
			{/* Table Header */}
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-xl font-bold text-gray-900" dir="rtl">{title}</h3>
				
				<div className="flex items-center gap-3">
					{/* Search */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							type="text"
							placeholder="البحث..."
							className="pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-right text-sm"
							dir="rtl"
						/>
					</div>
					
					{/* Filter */}
					<SoftUIButton variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
						تصفية
					</SoftUIButton>
					
					{/* Export */}
					<SoftUIButton variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
						تصدير
					</SoftUIButton>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-gray-200/50">
							{columns.map((column, index) => (
								<th 
									key={index}
									className="text-right py-4 px-4 text-sm font-semibold text-gray-600"
									dir="rtl"
								>
									{column.label}
								</th>
							))}
							<th className="text-center py-4 px-4 text-sm font-semibold text-gray-600">
								الإجراءات
							</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							// Loading placeholder rows
							[...Array(5)].map((_, rowIndex) => (
								<tr key={rowIndex} className="animate-pulse border-b border-gray-100/50">
									{columns.map((_, colIndex) => (
										<td key={colIndex} className="py-4 px-4">
											<div className="h-4 bg-gray-200 rounded w-24" />
										</td>
									))}
									<td className="py-4 px-4">
										<div className="h-4 bg-gray-200 rounded w-16 mx-auto" />
									</td>
								</tr>
							))
						) : (
							data.map((row, rowIndex) => (
								<tr 
									key={rowIndex}
									className="border-b border-gray-100/50 hover:bg-white/30 transition-colors duration-200"
								>
									{columns.map((column, colIndex) => (
										<td key={colIndex} className="py-4 px-4 text-sm text-gray-700">
											{column.render ? 
												column.render(row[column.key], row) : 
												<span dir="rtl">{row[column.key]}</span>
											}
										</td>
									))}
									<td className="py-4 px-4">
										<div className="flex items-center justify-center gap-2">
											<button className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
												<Eye className="w-4 h-4" />
											</button>
											<button className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
												<Edit className="w-4 h-4" />
											</button>
											<button className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
												<Trash2 className="w-4 h-4" />
											</button>
											<button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
												<MoreVertical className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200/50">
				<div className="text-sm text-gray-600" dir="rtl">
					عرض 1-10 من أصل 47 نتيجة
				</div>
				<div className="flex items-center gap-2">
					<SoftUIButton variant="outline" size="sm">السابق</SoftUIButton>
					<div className="flex items-center gap-1">
						{[1, 2, 3, 4, 5].map(page => (
							<button
								key={page}
								className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
									page === 1 
										? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
										: 'text-gray-600 hover:bg-white/50'
								}`}
							>
								{page}
							</button>
						))}
					</div>
					<SoftUIButton variant="outline" size="sm">التالي</SoftUIButton>
				</div>
			</div>
		</SoftUICard>
	);
};

export default SoftUITable;
