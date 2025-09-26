"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { CertificationCard } from "./CertificationCard"
import { CertificationForm } from "./CertificationForm"
import { cn } from "@/lib/utils"
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  SortAsc,
  SortDesc,
  X,
  Download,
  RefreshCw
} from "lucide-react"
import {
  Certification,
  CertificationFilter,
  CertificationCategory,
  CertificationLevel,
  CertificationStatus,
  VerificationStatus,
} from "@/types"

interface CertificationListProps {
  certifications: Certification[]
  onAdd?: (certification: Partial<Certification>) => void
  onEdit?: (certification: Certification) => void
  onDelete?: (certification: Certification) => void
  onDuplicate?: (certification: Certification) => void
  isLoading?: boolean
  className?: string
}

type ViewMode = 'grid' | 'list'
type SortField = 'name' | 'issueDate' | 'expirationDate' | 'status' | 'organization'
type SortDirection = 'asc' | 'desc'

const categories: { value: CertificationCategory; label: string }[] = [
  { value: 'cloud', label: 'Cloud Computing' },
  { value: 'development', label: 'Software Development' },
  { value: 'security', label: 'Cybersecurity' },
  { value: 'data', label: 'Data & Analytics' },
  { value: 'devops', label: 'DevOps & Infrastructure' },
  { value: 'management', label: 'Project Management' },
  { value: 'design', label: 'Design & UX' },
  { value: 'other', label: 'Other' },
]

const levels: { value: CertificationLevel; label: string }[] = [
  { value: 'foundational', label: 'Foundational' },
  { value: 'associate', label: 'Associate' },
  { value: 'professional', label: 'Professional' },
  { value: 'expert', label: 'Expert' },
  { value: 'specialist', label: 'Specialist' },
]

const statuses: { value: CertificationStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'expiring_soon', label: 'Expiring Soon' },
  { value: 'revoked', label: 'Revoked' },
]

const verificationStatuses: { value: VerificationStatus; label: string }[] = [
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending' },
  { value: 'unverified', label: 'Unverified' },
  { value: 'failed', label: 'Failed' },
]

export function CertificationList({
  certifications,
  onAdd,
  onEdit,
  onDelete,
  onDuplicate,
  isLoading = false,
  className,
}: CertificationListProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid')
  const [sortField, setSortField] = React.useState<SortField>('name')
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('asc')
  const [showForm, setShowForm] = React.useState(false)
  const [editingCertification, setEditingCertification] = React.useState<Certification | undefined>()

  const [filters, setFilters] = React.useState<CertificationFilter>({
    search: '',
    categories: [],
    levels: [],
    status: [],
    verificationStatus: [],
    issuingOrganizations: [],
    expiringWithinDays: undefined,
  })

  const [showFilters, setShowFilters] = React.useState(false)

  const uniqueOrganizations = React.useMemo(() => {
    const orgs = new Set(certifications.map(cert => cert.issuingOrganization))
    return Array.from(orgs).sort()
  }, [certifications])

  const filteredAndSortedCertifications = React.useMemo(() => {
    let filtered = certifications.filter(certification => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (
          !certification.name.toLowerCase().includes(searchLower) &&
          !certification.issuingOrganization.toLowerCase().includes(searchLower) &&
          !certification.description?.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      if (filters.categories?.length && !filters.categories.includes(certification.category)) {
        return false
      }

      if (filters.levels?.length && !filters.levels.includes(certification.level)) {
        return false
      }

      if (filters.status?.length && !filters.status.includes(certification.status)) {
        return false
      }

      if (filters.verificationStatus?.length && !filters.verificationStatus.includes(certification.verificationStatus)) {
        return false
      }

      if (filters.issuingOrganizations?.length && !filters.issuingOrganizations.includes(certification.issuingOrganization)) {
        return false
      }

      if (filters.expiringWithinDays !== undefined && certification.expirationDate) {
        const today = new Date()
        const daysUntilExpiration = Math.ceil(
          (certification.expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (daysUntilExpiration > filters.expiringWithinDays) {
          return false
        }
      }

      return true
    })

    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'issueDate':
          aValue = a.issueDate
          bValue = b.issueDate
          break
        case 'expirationDate':
          aValue = a.expirationDate || new Date('2099-12-31')
          bValue = b.expirationDate || new Date('2099-12-31')
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'organization':
          aValue = a.issuingOrganization
          bValue = b.issuingOrganization
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [certifications, filters, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      categories: [],
      levels: [],
      status: [],
      verificationStatus: [],
      issuingOrganizations: [],
      expiringWithinDays: undefined,
    })
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'search') return !!value
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined
  })

  const handleAdd = () => {
    setEditingCertification(undefined)
    setShowForm(true)
  }

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification)
    setShowForm(true)
  }

  const handleFormSubmit = (data: Partial<Certification>) => {
    if (editingCertification && onEdit) {
      onEdit({ ...editingCertification, ...data } as Certification)
    } else if (onAdd) {
      onAdd(data)
    }
    setShowForm(false)
    setEditingCertification(undefined)
  }

  const getExpiringCount = () => {
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    return certifications.filter(cert =>
      cert.expirationDate &&
      cert.expirationDate <= thirtyDaysFromNow &&
      cert.expirationDate > today &&
      cert.status === 'active'
    ).length
  }

  const expiringCount = getExpiringCount()

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Certifications</h2>
          <p className="text-muted-foreground">
            {filteredAndSortedCertifications.length} of {certifications.length} certifications
            {expiringCount > 0 && (
              <span className="ml-2">
                • <span className="text-amber-600 font-medium">{expiringCount} expiring soon</span>
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </Button>

          {onAdd && (
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search certifications..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    !
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Certifications</SheetTitle>
                <SheetDescription>
                  Narrow down the certification list using the filters below.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Categories Filter */}
                <div>
                  <Label className="text-sm font-medium">Categories</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {categories.map((category) => (
                      <div key={category.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.value}`}
                          checked={filters.categories?.includes(category.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters(prev => ({
                                ...prev,
                                categories: [...(prev.categories || []), category.value]
                              }))
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                categories: prev.categories?.filter(c => c !== category.value) || []
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={`category-${category.value}`} className="text-sm">
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {statuses.map((status) => (
                      <div key={status.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status.value}`}
                          checked={filters.status?.includes(status.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters(prev => ({
                                ...prev,
                                status: [...(prev.status || []), status.value]
                              }))
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                status: prev.status?.filter(s => s !== status.value) || []
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={`status-${status.value}`} className="text-sm">
                          {status.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expiring Soon Filter */}
                <div>
                  <Label htmlFor="expiring-filter" className="text-sm font-medium">
                    Expiring Within (days)
                  </Label>
                  <Select
                    value={filters.expiringWithinDays?.toString() || ''}
                    onValueChange={(value) =>
                      setFilters(prev => ({
                        ...prev,
                        expiringWithinDays: value ? parseInt(value) : undefined
                      }))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearFilters} className="flex-1">
                    <X className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                  <Button size="sm" onClick={() => setShowFilters(false)} className="flex-1">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort Options */}
          <Select value={`${sortField}-${sortDirection}`} onValueChange={(value) => {
            const [field, direction] = value.split('-') as [SortField, SortDirection]
            setSortField(field)
            setSortDirection(direction)
          }}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="issueDate-desc">Issue Date (Newest)</SelectItem>
              <SelectItem value="issueDate-asc">Issue Date (Oldest)</SelectItem>
              <SelectItem value="expirationDate-asc">Expiration (Soonest)</SelectItem>
              <SelectItem value="expirationDate-desc">Expiration (Latest)</SelectItem>
              <SelectItem value="organization-asc">Organization A-Z</SelectItem>
              <SelectItem value="organization-desc">Organization Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading certifications...
        </div>
      ) : filteredAndSortedCertifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {certifications.length === 0
              ? "No certifications found. Add your first certification to get started."
              : "No certifications match your current filters."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        )}>
          {filteredAndSortedCertifications.map((certification) => (
            <CertificationCard
              key={certification.id}
              certification={certification}
              variant={viewMode === 'list' ? 'compact' : 'detailed'}
              onEdit={onEdit ? () => handleEdit(certification) : undefined}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <CertificationForm
        open={showForm}
        onOpenChange={setShowForm}
        certification={editingCertification}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}