'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Project } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectTableProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onStatusChange?: (project: Project, status: Project['status']) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  className?: string;
}

const statusConfig = {
  planning: { color: 'bg-blue-500', label: 'Planning', variant: 'secondary' as const },
  active: { color: 'bg-green-500', label: 'Active', variant: 'default' as const },
  'on-hold': { color: 'bg-yellow-500', label: 'On Hold', variant: 'outline' as const },
  completed: { color: 'bg-gray-500', label: 'Completed', variant: 'secondary' as const },
  cancelled: { color: 'bg-red-500', label: 'Cancelled', variant: 'destructive' as const },
};

const priorityConfig = {
  low: { color: 'text-green-600', label: 'Low' },
  medium: { color: 'text-yellow-600', label: 'Medium' },
  high: { color: 'text-orange-600', label: 'High' },
  urgent: { color: 'text-red-600', label: 'Urgent' },
};

export default function ProjectTable({
  projects,
  onEdit,
  onDelete,
  onStatusChange,
  onSelectionChange,
  className
}: ProjectTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const columns: ColumnDef<Project>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Project Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="max-w-xs">
            <Link
              href={`/projects/${project.id}`}
              className="font-medium hover:text-primary transition-colors"
            >
              {project.name}
            </Link>
            <p className="text-sm text-muted-foreground truncate mt-1">
              {project.description}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'client.name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const client = row.original.client;
        return (
          <div>
            <div className="font-medium">{client.name}</div>
            <div className="text-sm text-muted-foreground">{client.industry}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'consultant',
      header: 'Consultant',
      cell: ({ row }) => {
        const consultant = row.original.consultant;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={consultant.avatar} />
              <AvatarFallback className="text-xs">
                {getInitials(consultant.firstName, consultant.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {consultant.firstName} {consultant.lastName}
              </div>
              <div className="text-sm text-muted-foreground">{consultant.title}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = statusConfig[row.original.status];
        return (
          <Badge variant={status.variant} className="whitespace-nowrap">
            {status.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const priority = priorityConfig[row.original.priority];
        return (
          <span className={cn('font-medium', priority.color)}>
            {priority.label}
          </span>
        );
      },
    },
    {
      accessorKey: 'technologies',
      header: 'Technologies',
      cell: ({ row }) => {
        const technologies = row.original.technologies;
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {technologies.slice(0, 2).map((tech) => (
              <Badge key={tech.id} variant="outline" className="text-xs">
                {tech.name}
              </Badge>
            ))}
            {technologies.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{technologies.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'startDate',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Start Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatDate(row.original.startDate),
    },
    {
      accessorKey: 'endDate',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          End Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatDate(row.original.endDate),
    },
    {
      accessorKey: 'budget',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Budget
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const budget = row.original.budget;
        return budget ? formatCurrency(budget) : '-';
      },
    },
    {
      accessorKey: 'progress',
      header: 'Progress',
      cell: ({ row }) => {
        const project = row.original;
        const progressPercentage = project.estimatedHours > 0
          ? Math.round(((project.actualHours || 0) / project.estimatedHours) * 100)
          : 0;

        return (
          <div className="space-y-1 min-w-24">
            <div className="text-xs text-muted-foreground">
              {project.actualHours || 0}h / {project.estimatedHours}h
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <div className="text-xs font-medium text-center">
              {progressPercentage}%
            </div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const project = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project.id}`} className="flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project.id}/edit`}>
                  Edit Project
                </Link>
              </DropdownMenuItem>
              {onStatusChange && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onStatusChange(project, 'active')}
                    disabled={project.status === 'active'}
                  >
                    Mark as Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onStatusChange(project, 'on-hold')}
                    disabled={project.status === 'on-hold'}
                  >
                    Put on Hold
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onStatusChange(project, 'completed')}
                    disabled={project.status === 'completed'}
                  >
                    Mark as Completed
                  </DropdownMenuItem>
                </>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(project)}
                    className="text-destructive"
                  >
                    Delete Project
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: projects,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  // Handle selection change
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map(row => row.original.id);

  // Call onSelectionChange when selection changes
  React.useEffect(() => {
    onSelectionChange?.(selectedIds);
  }, [selectedIds, onSelectionChange]);

  return (
    <div className={className}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </div>
  );
}