'use client';

import { useState, useCallback } from 'react';
import { Search, Filter, X, Calendar, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectSearchFilters, Project } from '@/types';
import { mockClients, mockConsultants, mockTechnologies } from '@/lib/mock-data';

interface SearchFiltersProps {
  filters: ProjectSearchFilters;
  onFiltersChange: (filters: ProjectSearchFilters) => void;
  onClearFilters: () => void;
  resultsCount: number;
  className?: string;
}

const statusOptions: Array<{ value: Project['status']; label: string }> = [
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const priorityOptions: Array<{ value: Project['priority']; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const projectTypeOptions: Array<{ value: Project['projectType']; label: string }> = [
  { value: 'development', label: 'Development' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'audit', label: 'Audit' },
  { value: 'training', label: 'Training' },
  { value: 'support', label: 'Support' },
  { value: 'other', label: 'Other' },
];

export default function SearchFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  resultsCount,
  className
}: SearchFiltersProps) {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const updateFilters = useCallback((updates: Partial<ProjectSearchFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  }, [filters, onFiltersChange]);

  const handleSearchChange = useCallback((value: string) => {
    updateFilters({ search: value });
  }, [updateFilters]);

  const handleArrayFilterChange = useCallback(
    <T extends string>(
      filterKey: keyof ProjectSearchFilters,
      value: T,
      checked: boolean
    ) => {
      const currentArray = (filters[filterKey] as T[]) || [];
      const newArray = checked
        ? [...currentArray, value]
        : currentArray.filter(item => item !== value);
      updateFilters({ [filterKey]: newArray });
    },
    [filters, updateFilters]
  );

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status.length > 0) count++;
    if (filters.priority.length > 0) count++;
    if (filters.technologies.length > 0) count++;
    if (filters.clients.length > 0) count++;
    if (filters.consultants.length > 0) count++;
    if (filters.projectTypes.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.budgetRange.min || filters.budgetRange.max) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">{title}</h4>
      {children}
    </div>
  );

  const CheckboxGroup = ({
    options,
    selectedValues,
    onSelectionChange,
  }: {
    options: Array<{ value: string; label: string }>;
    selectedValues: string[];
    onSelectionChange: (value: string, checked: boolean) => void;
  }) => (
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <Checkbox
            id={option.value}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={(checked) =>
              onSelectionChange(option.value, checked as boolean)
            }
          />
          <Label htmlFor={option.value} className="text-sm font-normal">
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );

  return (
    <div className={className}>
      <div className="flex items-center gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects, clients, consultants..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Status Filter */}
        <Select
          value={filters.status.length === 1 ? filters.status[0] : 'all'}
          onValueChange={(value) => {
            if (value && value !== 'all') {
              updateFilters({ status: [value as Project['status']] });
            } else {
              updateFilters({ status: [] });
            }
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters Button */}
        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 px-1.5 text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-96 sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter Projects</SheetTitle>
              <SheetDescription>
                Use filters to find specific projects
              </SheetDescription>
            </SheetHeader>

            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
              <div className="space-y-6 pr-4">
                {/* Status Filter */}
                <FilterSection title="Status">
                  <CheckboxGroup
                    options={statusOptions}
                    selectedValues={filters.status}
                    onSelectionChange={(value, checked) =>
                      handleArrayFilterChange('status', value as Project['status'], checked)
                    }
                  />
                </FilterSection>

                <Separator />

                {/* Priority Filter */}
                <FilterSection title="Priority">
                  <CheckboxGroup
                    options={priorityOptions}
                    selectedValues={filters.priority}
                    onSelectionChange={(value, checked) =>
                      handleArrayFilterChange('priority', value as Project['priority'], checked)
                    }
                  />
                </FilterSection>

                <Separator />

                {/* Project Type Filter */}
                <FilterSection title="Project Type">
                  <CheckboxGroup
                    options={projectTypeOptions}
                    selectedValues={filters.projectTypes}
                    onSelectionChange={(value, checked) =>
                      handleArrayFilterChange('projectTypes', value as Project['projectType'], checked)
                    }
                  />
                </FilterSection>

                <Separator />

                {/* Technologies Filter */}
                <FilterSection title="Technologies">
                  <CheckboxGroup
                    options={mockTechnologies.map(tech => ({ value: tech.id, label: tech.name }))}
                    selectedValues={filters.technologies}
                    onSelectionChange={(value, checked) =>
                      handleArrayFilterChange('technologies', value, checked)
                    }
                  />
                </FilterSection>

                <Separator />

                {/* Clients Filter */}
                <FilterSection title="Clients">
                  <CheckboxGroup
                    options={mockClients.map(client => ({ value: client.id, label: client.name }))}
                    selectedValues={filters.clients}
                    onSelectionChange={(value, checked) =>
                      handleArrayFilterChange('clients', value, checked)
                    }
                  />
                </FilterSection>

                <Separator />

                {/* Consultants Filter */}
                <FilterSection title="Consultants">
                  <CheckboxGroup
                    options={mockConsultants.map(consultant => ({
                      value: consultant.id,
                      label: `${consultant.firstName} ${consultant.lastName}`
                    }))}
                    selectedValues={filters.consultants}
                    onSelectionChange={(value, checked) =>
                      handleArrayFilterChange('consultants', value, checked)
                    }
                  />
                </FilterSection>

                <Separator />

                {/* Date Range Filter */}
                <FilterSection title="Date Range">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                        <Input
                          id="start-date"
                          type="date"
                          value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
                          onChange={(e) => updateFilters({
                            dateRange: {
                              ...filters.dateRange,
                              start: e.target.value ? new Date(e.target.value) : undefined
                            }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="end-date" className="text-xs">End Date</Label>
                        <Input
                          id="end-date"
                          type="date"
                          value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
                          onChange={(e) => updateFilters({
                            dateRange: {
                              ...filters.dateRange,
                              end: e.target.value ? new Date(e.target.value) : undefined
                            }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </FilterSection>

                <Separator />

                {/* Budget Range Filter */}
                <FilterSection title="Budget Range">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="min-budget" className="text-xs">Min Budget ($)</Label>
                        <Input
                          id="min-budget"
                          type="number"
                          placeholder="0"
                          value={filters.budgetRange.min || ''}
                          onChange={(e) => updateFilters({
                            budgetRange: {
                              ...filters.budgetRange,
                              min: e.target.value ? parseInt(e.target.value) : undefined
                            }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-budget" className="text-xs">Max Budget ($)</Label>
                        <Input
                          id="max-budget"
                          type="number"
                          placeholder="1000000"
                          value={filters.budgetRange.max || ''}
                          onChange={(e) => updateFilters({
                            budgetRange: {
                              ...filters.budgetRange,
                              max: e.target.value ? parseInt(e.target.value) : undefined
                            }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </FilterSection>
              </div>
            </ScrollArea>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button
                onClick={() => setIsFilterSheetOpen(false)}
                className="flex-1"
              >
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Clear Filters Button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.status.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              {statusOptions.find(s => s.value === status)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleArrayFilterChange('status', status, false)}
              />
            </Badge>
          ))}
          {filters.priority.map((priority) => (
            <Badge key={priority} variant="secondary" className="gap-1">
              {priorityOptions.find(p => p.value === priority)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleArrayFilterChange('priority', priority, false)}
              />
            </Badge>
          ))}
          {/* Add more active filter badges as needed */}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {resultsCount} {resultsCount === 1 ? 'project' : 'projects'} found
      </div>
    </div>
  );
}