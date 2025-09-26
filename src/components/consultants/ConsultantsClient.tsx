'use client';

import React, { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { Plus, LayoutGrid, List, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import ConsultantCard from './ConsultantCard';
import ConsultantTable from './ConsultantTable';
import ConsultantSearchFilters from './ConsultantSearchFilters';
import { Consultant, ConsultantSearchFilters as ConsultantFilters, ConsultantViewMode } from '@/types';
import { deleteConsultant, updateConsultantAvailability, bulkDeleteConsultants } from '@/lib/actions/consultants';

const defaultFilters: ConsultantFilters = {
  search: '',
  availability: [],
  skills: [],
  departments: [],
  experienceRange: {},
};

interface ConsultantsClientProps {
  initialConsultants: Consultant[];
  consultantStats: {
    total: number;
    available: number;
    busy: number;
    unavailable: number;
  };
}

export default function ConsultantsClient({ initialConsultants, consultantStats }: ConsultantsClientProps) {
  const [consultants, setConsultants] = useState<Consultant[]>(initialConsultants);
  const [filters, setFilters] = useState<ConsultantFilters>(defaultFilters);
  const [viewMode, setViewMode] = useState<ConsultantViewMode['type']>('cards');
  const [selectedConsultantIds, setSelectedConsultantIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [consultantToDelete, setConsultantToDelete] = useState<Consultant | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Filter and search consultants
  const filteredConsultants = useMemo(() => {
    let filtered = [...consultants];

    // Text search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (consultant) =>
          consultant.firstName.toLowerCase().includes(searchLower) ||
          consultant.lastName.toLowerCase().includes(searchLower) ||
          consultant.email.toLowerCase().includes(searchLower) ||
          consultant.title.toLowerCase().includes(searchLower) ||
          consultant.department?.toLowerCase().includes(searchLower) ||
          consultant.skills.some(skill => skill.name.toLowerCase().includes(searchLower))
      );
    }

    // Availability filter
    if (filters.availability.length > 0) {
      filtered = filtered.filter((consultant) =>
        filters.availability.includes(consultant.availability)
      );
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter((consultant) =>
        consultant.skills.some((skill) =>
          filters.skills.includes(skill.id)
        )
      );
    }

    // Department filter
    if (filters.departments.length > 0) {
      filtered = filtered.filter((consultant) =>
        consultant.department && filters.departments.includes(consultant.department)
      );
    }

    // Experience range filter
    if (filters.experienceRange.min !== undefined || filters.experienceRange.max !== undefined) {
      filtered = filtered.filter((consultant) => {
        if (filters.experienceRange.min !== undefined && consultant.experience < filters.experienceRange.min) {
          return false;
        }
        if (filters.experienceRange.max !== undefined && consultant.experience > filters.experienceRange.max) {
          return false;
        }
        return true;
      });
    }

    return filtered;
  }, [consultants, filters]);

  const handleFiltersChange = (newFilters: ConsultantFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  const handleAvailabilityChange = (consultant: Consultant, availability: Consultant['availability']) => {
    startTransition(async () => {
      const result = await updateConsultantAvailability(consultant.id, availability);
      if (result.success) {
        setConsultants((prev) =>
          prev.map((c) =>
            c.id === consultant.id
              ? { ...c, availability, updatedAt: new Date() }
              : c
          )
        );
        toast({
          title: 'Consultant Updated',
          description: `${consultant.firstName} ${consultant.lastName} availability changed to ${availability}`,
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update consultant availability',
          variant: 'destructive',
        });
      }
    });
  };

  const handleDeleteConsultant = (consultant: Consultant) => {
    setConsultantToDelete(consultant);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (consultantToDelete) {
      startTransition(async () => {
        const result = await deleteConsultant(consultantToDelete.id);
        if (result.success) {
          setConsultants((prev) => prev.filter((c) => c.id !== consultantToDelete.id));
          toast({
            title: 'Consultant Deleted',
            description: `${consultantToDelete.firstName} ${consultantToDelete.lastName} has been deleted`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to delete consultant',
            variant: 'destructive',
          });
        }
        setConsultantToDelete(null);
      });
    }
    setDeleteDialogOpen(false);
  };

  const handleBulkDelete = () => {
    if (selectedConsultantIds.length === 0) return;

    startTransition(async () => {
      const result = await bulkDeleteConsultants(selectedConsultantIds);
      if (result.success) {
        setConsultants((prev) =>
          prev.filter((c) => !selectedConsultantIds.includes(c.id))
        );
        toast({
          title: 'Consultants Deleted',
          description: `${result.count} consultant(s) have been deleted`,
          variant: 'destructive',
        });
        setSelectedConsultantIds([]);
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete consultants',
          variant: 'destructive',
        });
      }
    });
  };

  const handleExportConsultants = () => {
    const exportData = selectedConsultantIds.length > 0
      ? filteredConsultants.filter(c => selectedConsultantIds.includes(c.id))
      : filteredConsultants;

    console.log('Exporting consultants:', exportData);
    toast({
      title: 'Export Started',
      description: `Exporting ${exportData.length} consultant(s)`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Consultants</h1>
          <p className="text-muted-foreground">
            Manage and track all consultants, their skills, and availability
          </p>
        </div>
        <Link href="/consultants/new">
          <Button disabled={isPending}>
            <Plus className="mr-2 h-4 w-4" />
            New Consultant
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{consultantStats.total}</div>
            <p className="text-xs text-muted-foreground">Total Consultants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{consultantStats.available}</div>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-600">{consultantStats.busy}</div>
            <p className="text-xs text-muted-foreground">Busy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">{consultantStats.unavailable}</div>
            <p className="text-xs text-muted-foreground">Unavailable</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <ConsultantSearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        resultsCount={filteredConsultants.length}
      />

      {/* View Controls and Bulk Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="h-8"
              disabled={isPending}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8"
              disabled={isPending}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedConsultantIds.length > 0 && (
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-muted-foreground">
                {selectedConsultantIds.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportConsultants}
                disabled={isPending}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="text-destructive hover:text-destructive"
                disabled={isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportConsultants} disabled={isPending}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Consultants Display */}
      {filteredConsultants.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No consultants found</h3>
              <p className="text-muted-foreground mb-4">
                {filters.search || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f)
                  ? 'Try adjusting your search criteria or filters'
                  : 'Get started by adding your first consultant'
                }
              </p>
              <Link href="/consultants/new">
                <Button disabled={isPending}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Consultant
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsultants.map((consultant) => (
            <ConsultantCard
              key={consultant.id}
              consultant={consultant}
              onAvailabilityChange={handleAvailabilityChange}
              onDelete={handleDeleteConsultant}
            />
          ))}
        </div>
      ) : (
        <ConsultantTable
          consultants={filteredConsultants}
          onAvailabilityChange={handleAvailabilityChange}
          onDelete={handleDeleteConsultant}
          onSelectionChange={setSelectedConsultantIds}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Consultant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{consultantToDelete?.firstName} {consultantToDelete?.lastName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}