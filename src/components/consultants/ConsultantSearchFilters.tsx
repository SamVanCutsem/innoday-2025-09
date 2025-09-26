'use client';

import { useState, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
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
import { ConsultantSearchFilters, Consultant } from '@/types';
import { mockConsultants, mockTechnologies } from '@/lib/mock-data';

interface ConsultantSearchFiltersProps {
  filters: ConsultantSearchFilters;
  onFiltersChange: (filters: ConsultantSearchFilters) => void;
  onClearFilters: () => void;
  resultsCount: number;
  className?: string;
}

const availabilityOptions: Array<{ value: Consultant['availability']; label: string }> = [
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'unavailable', label: 'Unavailable' },
];

// Extract unique departments from mock data
const departmentOptions = Array.from(
  new Set(mockConsultants.map(c => c.department).filter(Boolean))
).map(dept => ({ value: dept!, label: dept! }));

export default function ConsultantSearchFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  resultsCount,
  className
}: ConsultantSearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = useCallback((updates: Partial<ConsultantSearchFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  }, [filters, onFiltersChange]);

  const handleSearchChange = (value: string) => {
    updateFilters({ search: value });
  };

  const handleAvailabilityToggle = (availability: Consultant['availability']) => {
    const newAvailability = filters.availability.includes(availability)
      ? filters.availability.filter(s => s !== availability)
      : [...filters.availability, availability];
    updateFilters({ availability: newAvailability });
  };

  const handleSkillToggle = (skillId: string) => {
    const newSkills = filters.skills.includes(skillId)
      ? filters.skills.filter(s => s !== skillId)
      : [...filters.skills, skillId];
    updateFilters({ skills: newSkills });
  };

  const handleDepartmentToggle = (department: string) => {
    const newDepartments = filters.departments.includes(department)
      ? filters.departments.filter(d => d !== department)
      : [...filters.departments, department];
    updateFilters({ departments: newDepartments });
  };

  const handleExperienceRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : parseInt(value);
    updateFilters({
      experienceRange: {
        ...filters.experienceRange,
        [field]: numValue
      }
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.availability.length > 0 ||
    filters.skills.length > 0 ||
    filters.departments.length > 0 ||
    filters.experienceRange.min !== undefined ||
    filters.experienceRange.max !== undefined;

  const activeFilterCount =
    (filters.availability.length > 0 ? 1 : 0) +
    (filters.skills.length > 0 ? 1 : 0) +
    (filters.departments.length > 0 ? 1 : 0) +
    (filters.experienceRange.min !== undefined || filters.experienceRange.max !== undefined ? 1 : 0);

  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search consultants..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Sheet */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Filter Consultants</SheetTitle>
              <SheetDescription>
                Narrow down consultants by availability, skills, and experience.
              </SheetDescription>
            </SheetHeader>

            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
              <div className="space-y-6">
                {/* Availability Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Availability</Label>
                  <div className="space-y-2">
                    {availabilityOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`availability-${option.value}`}
                          checked={filters.availability.includes(option.value)}
                          onCheckedChange={() => handleAvailabilityToggle(option.value)}
                        />
                        <Label
                          htmlFor={`availability-${option.value}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Skills Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Skills</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {mockTechnologies.map((tech) => (
                      <div key={tech.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${tech.id}`}
                          checked={filters.skills.includes(tech.id)}
                          onCheckedChange={() => handleSkillToggle(tech.id)}
                        />
                        <Label
                          htmlFor={`skill-${tech.id}`}
                          className="text-sm font-normal cursor-pointer truncate"
                        >
                          {tech.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Department Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Department</Label>
                  <div className="space-y-2">
                    {departmentOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`department-${option.value}`}
                          checked={filters.departments.includes(option.value)}
                          onCheckedChange={() => handleDepartmentToggle(option.value)}
                        />
                        <Label
                          htmlFor={`department-${option.value}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Experience Range Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Experience (Years)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="exp-min" className="text-xs text-muted-foreground">
                        Minimum
                      </Label>
                      <Input
                        id="exp-min"
                        type="number"
                        placeholder="0"
                        min="0"
                        max="50"
                        value={filters.experienceRange.min ?? ''}
                        onChange={(e) => handleExperienceRangeChange('min', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="exp-max" className="text-xs text-muted-foreground">
                        Maximum
                      </Label>
                      <Input
                        id="exp-max"
                        type="number"
                        placeholder="50"
                        min="0"
                        max="50"
                        value={filters.experienceRange.max ?? ''}
                        onChange={(e) => handleExperienceRangeChange('max', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                onClick={onClearFilters}
                disabled={!hasActiveFilters}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button onClick={() => setIsOpen(false)} className="flex-1">
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {filters.availability.map((availability) => (
            <Badge key={availability} variant="secondary" className="gap-1">
              {availabilityOptions.find(opt => opt.value === availability)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleAvailabilityToggle(availability)}
              />
            </Badge>
          ))}

          {filters.skills.map((skillId) => {
            const skill = mockTechnologies.find(t => t.id === skillId);
            return skill ? (
              <Badge key={skillId} variant="secondary" className="gap-1">
                {skill.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleSkillToggle(skillId)}
                />
              </Badge>
            ) : null;
          })}

          {filters.departments.map((department) => (
            <Badge key={department} variant="secondary" className="gap-1">
              {department}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleDepartmentToggle(department)}
              />
            </Badge>
          ))}

          {(filters.experienceRange.min !== undefined || filters.experienceRange.max !== undefined) && (
            <Badge variant="secondary" className="gap-1">
              Experience: {filters.experienceRange.min ?? 0}-{filters.experienceRange.max ?? '50+'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilters({ experienceRange: {} })}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground mt-2">
        {resultsCount} consultant{resultsCount !== 1 ? 's' : ''} found
      </div>
    </div>
  );
}