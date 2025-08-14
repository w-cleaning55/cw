"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronDown, ChevronUp, MoreHorizontal, Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react";

// ===== PROFESSIONAL TABLE COMPONENTS =====

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="table-container">
    <table
      ref={ref}
      className={cn("table", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-muted/50 font-medium", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

// ===== PROFESSIONAL TABLE FEATURES =====

interface SortableTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
  children: React.ReactNode;
}

const SortableTableHead = React.forwardRef<
  HTMLTableCellElement,
  SortableTableHeadProps
>(({ className, sortable = false, sortDirection, onSort, children, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      sortable && "cursor-pointer select-none hover:bg-muted/50",
      className
    )}
    onClick={sortable ? onSort : undefined}
    {...props}
  >
    <div className="flex items-center justify-end gap-2">
      {children}
      {sortable && (
        <div className="flex flex-col">
          <ChevronUp className={cn(
            "h-3 w-3 transition-colors",
            sortDirection === "asc" ? "text-primary" : "text-muted-foreground/50"
          )} />
          <ChevronDown className={cn(
            "h-3 w-3 -mt-1 transition-colors",
            sortDirection === "desc" ? "text-primary" : "text-muted-foreground/50"
          )} />
        </div>
      )}
    </div>
  </th>
));
SortableTableHead.displayName = "SortableTableHead";

// ===== PROFESSIONAL TABLE ACTIONS =====

interface TableActionsProps {
  children: React.ReactNode;
  className?: string;
}

const TableActions = React.forwardRef<HTMLDivElement, TableActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
);
TableActions.displayName = "TableActions";

const TableActionButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "ghost" | "outline";
    size?: "sm" | "md";
  }
>(({ className, variant = "ghost", size = "sm", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      {
        "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
        "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
        "border border-input hover:bg-accent hover:text-accent-foreground": variant === "outline",
        "h-8 w-8": size === "sm",
        "h-10 px-4 py-2": size === "md",
      },
      className
    )}
    {...props}
  />
));
TableActionButton.displayName = "TableActionButton";

// ===== PROFESSIONAL TABLE TOOLBAR =====

interface TableToolbarProps {
  children: React.ReactNode;
  className?: string;
}

const TableToolbar = React.forwardRef<HTMLDivElement, TableToolbarProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between py-4", className)}
      {...props}
    >
      {children}
    </div>
  )
);
TableToolbar.displayName = "TableToolbar";

const TableSearch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <div className="relative">
    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10",
        className
      )}
      {...props}
    />
  </div>
));
TableSearch.displayName = "TableSearch";

// ===== PROFESSIONAL TABLE PAGINATION =====

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const TablePagination = React.forwardRef<HTMLDivElement, TablePaginationProps>(
  ({ className, currentPage, totalPages, onPageChange, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between px-2", className)}
      {...props}
    >
      <div className="flex-1 text-sm text-muted-foreground">
        الصفحة {currentPage} من {totalPages}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input hover:bg-accent hover:text-accent-foreground h-8 px-3"
          >
            السابق
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input hover:bg-accent hover:text-accent-foreground h-8 px-3"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  )
);
TablePagination.displayName = "TablePagination";

// ===== PROFESSIONAL TABLE EXPORT =====

const TableExport = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
      className
    )}
    {...props}
  >
    <Download className="ml-2 h-4 w-4" />
    تصدير
  </button>
));
TableExport.displayName = "TableExport";

// ===== PROFESSIONAL TABLE FILTER =====

const TableFilter = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
      className
    )}
    {...props}
  >
    <Filter className="ml-2 h-4 w-4" />
    تصفية
  </button>
));
TableFilter.displayName = "TableFilter";

// ===== PROFESSIONAL TABLE ROW ACTIONS =====

interface TableRowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const TableRowActions = React.forwardRef<HTMLDivElement, TableRowActionsProps>(
  ({ className, onView, onEdit, onDelete, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {onView && (
        <TableActionButton
          size="sm"
          variant="ghost"
          onClick={onView}
          title="عرض"
        >
          <Eye className="h-4 w-4" />
        </TableActionButton>
      )}
      {onEdit && (
        <TableActionButton
          size="sm"
          variant="ghost"
          onClick={onEdit}
          title="تعديل"
        >
          <Edit className="h-4 w-4" />
        </TableActionButton>
      )}
      {onDelete && (
        <TableActionButton
          size="sm"
          variant="ghost"
          onClick={onDelete}
          title="حذف"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </TableActionButton>
      )}
    </div>
  )
);
TableRowActions.displayName = "TableRowActions";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  SortableTableHead,
  TableActions,
  TableActionButton,
  TableToolbar,
  TableSearch,
  TablePagination,
  TableExport,
  TableFilter,
  TableRowActions,
};
