'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Consultant } from '@/types';
import { cn } from '@/lib/utils';

interface ConsultantTableProps {
  consultants: Consultant[];
  onEdit?: (consultant: Consultant) => void;
  onDelete?: (consultant: Consultant) => void;
  onAvailabilityChange?: (consultant: Consultant, availability: Consultant['availability']) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  className?: string;
}

type SortField = 'name' | 'title' | 'experience' | 'availability' | 'department';
type SortDirection = 'asc' | 'desc';

const availabilityConfig = {
  available: { color: 'bg-green-500', label: 'Available', variant: 'default' as const },
  busy: { color: 'bg-yellow-500', label: 'Busy', variant: 'secondary' as const },
  unavailable: { color: 'bg-red-500', label: 'Unavailable', variant: 'destructive' as const },
};

export default function ConsultantTable({
  consultants,
  onEdit,
  onDelete,
  onAvailabilityChange,
  onSelectionChange,
  className
}: ConsultantTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedConsultants = [...consultants].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'name':
        aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
        bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'experience':
        aValue = a.experience;
        bValue = b.experience;
        break;
      case 'availability':
        aValue = a.availability;
        bValue = b.availability;
        break;
      case 'department':
        aValue = (a.department || '').toLowerCase();
        bValue = (b.department || '').toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = consultants.map(c => c.id);
      setSelectedIds(allIds);
      onSelectionChange?.(allIds);
    } else {
      setSelectedIds([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectConsultant = (consultantId: string, checked: boolean) => {
    let newSelectedIds: string[];
    if (checked) {
      newSelectedIds = [...selectedIds, consultantId];
    } else {
      newSelectedIds = selectedIds.filter(id => id !== consultantId);
    }
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 p-0 font-medium"
      onClick={() => handleSort(field)}
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc'
          ? <ChevronUp className="ml-1 h-3 w-3" />
          : <ChevronDown className="ml-1 h-3 w-3" />
      )}
    </Button>
  );

  return (
    <div className={cn('rounded-md border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === consultants.length && consultants.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all consultants"
              />
            </TableHead>
            <TableHead>
              <SortButton field="name">Name</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="title">Title</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="department">Department</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="experience">Experience</SortButton>
            </TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>
              <SortButton field="availability">Status</SortButton>
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedConsultants.map((consultant) => {
            const availability = availabilityConfig[consultant.availability];
            const initials = `${consultant.firstName.charAt(0)}${consultant.lastName.charAt(0)}`;
            const isSelected = selectedIds.includes(consultant.id);

            return (
              <TableRow key={consultant.id} className={isSelected ? 'bg-muted/50' : ''}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectConsultant(consultant.id, checked as boolean)}
                    aria-label={`Select ${consultant.firstName} ${consultant.lastName}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={consultant.avatar} alt={`${consultant.firstName} ${consultant.lastName}`} />
                      <AvatarFallback className="text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/consultants/${consultant.id}`}>
                        <div className="font-medium hover:text-primary cursor-pointer">
                          {consultant.firstName} {consultant.lastName}
                        </div>
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        {consultant.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {consultant.title}
                </TableCell>
                <TableCell>
                  {consultant.department || '-'}
                </TableCell>
                <TableCell>
                  {consultant.experience} years
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-48">
                    {consultant.skills.slice(0, 2).map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: skill.color, color: skill.color }}
                      >
                        {skill.name}
                      </Badge>
                    ))}
                    {consultant.skills.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{consultant.skills.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={availability.variant} className="text-xs">
                    <div className={cn('w-2 h-2 rounded-full mr-1', availability.color)} />
                    {availability.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/consultants/${consultant.id}`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/consultants/${consultant.id}/edit`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {onAvailabilityChange && (
                        <>
                          <DropdownMenuItem
                            onClick={() => onAvailabilityChange(consultant, 'available')}
                            disabled={consultant.availability === 'available'}
                          >
                            Mark Available
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onAvailabilityChange(consultant, 'busy')}
                            disabled={consultant.availability === 'busy'}
                          >
                            Mark Busy
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onAvailabilityChange(consultant, 'unavailable')}
                            disabled={consultant.availability === 'unavailable'}
                          >
                            Mark Unavailable
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(consultant)}
                          className="text-destructive focus:text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {consultants.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No consultants found
        </div>
      )}
    </div>
  );
}