"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Certification,
  CertificationCategory,
  CertificationLevel,
  CertificationStatus,
  VerificationStatus,
} from "@/types"

interface CertificationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  certification?: Certification
  onSubmit: (data: Partial<Certification>) => void
  isLoading?: boolean
}

interface FormData {
  name: string
  issuingOrganization: string
  issueDate: string
  expirationDate: string
  credentialId: string
  credentialUrl: string
  description: string
  category: CertificationCategory
  level: CertificationLevel
  status: CertificationStatus
  verificationStatus: VerificationStatus
  logo: string
}

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
  { value: 'pending', label: 'Pending Verification' },
  { value: 'unverified', label: 'Unverified' },
  { value: 'failed', label: 'Verification Failed' },
]

export function CertificationForm({
  open,
  onOpenChange,
  certification,
  onSubmit,
  isLoading = false,
}: CertificationFormProps) {
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    issuingOrganization: '',
    issueDate: '',
    expirationDate: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    category: 'development',
    level: 'professional',
    status: 'active',
    verificationStatus: 'unverified',
    logo: '',
  })

  const [errors, setErrors] = React.useState<Partial<FormData>>({})

  React.useEffect(() => {
    if (certification) {
      setFormData({
        name: certification.name,
        issuingOrganization: certification.issuingOrganization,
        issueDate: certification.issueDate.toISOString().split('T')[0],
        expirationDate: certification.expirationDate
          ? certification.expirationDate.toISOString().split('T')[0]
          : '',
        credentialId: certification.credentialId || '',
        credentialUrl: certification.credentialUrl || '',
        description: certification.description || '',
        category: certification.category,
        level: certification.level,
        status: certification.status,
        verificationStatus: certification.verificationStatus,
        logo: certification.logo || '',
      })
    } else {
      setFormData({
        name: '',
        issuingOrganization: '',
        issueDate: '',
        expirationDate: '',
        credentialId: '',
        credentialUrl: '',
        description: '',
        category: 'development',
        level: 'professional',
        status: 'active',
        verificationStatus: 'unverified',
        logo: '',
      })
    }
    setErrors({})
  }, [certification, open])

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Certification name is required'
    }

    if (!formData.issuingOrganization.trim()) {
      newErrors.issuingOrganization = 'Issuing organization is required'
    }

    if (!formData.issueDate) {
      newErrors.issueDate = 'Issue date is required'
    }

    if (formData.expirationDate && formData.issueDate) {
      const issueDate = new Date(formData.issueDate)
      const expirationDate = new Date(formData.expirationDate)
      if (expirationDate <= issueDate) {
        newErrors.expirationDate = 'Expiration date must be after issue date'
      }
    }

    if (formData.credentialUrl && !isValidUrl(formData.credentialUrl)) {
      newErrors.credentialUrl = 'Please enter a valid URL'
    }

    if (formData.logo && !isValidUrl(formData.logo)) {
      newErrors.logo = 'Please enter a valid URL for the logo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitData: Partial<Certification> = {
      name: formData.name,
      issuingOrganization: formData.issuingOrganization,
      issueDate: new Date(formData.issueDate),
      expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : undefined,
      credentialId: formData.credentialId || undefined,
      credentialUrl: formData.credentialUrl || undefined,
      description: formData.description || undefined,
      category: formData.category,
      level: formData.level,
      status: formData.status,
      verificationStatus: formData.verificationStatus,
      logo: formData.logo || undefined,
    }

    if (certification) {
      submitData.id = certification.id
    }

    onSubmit(submitData)
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {certification ? 'Edit Certification' : 'Add New Certification'}
          </DialogTitle>
          <DialogDescription>
            {certification
              ? 'Update the certification details below.'
              : 'Fill in the details for the new certification.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Certification Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuingOrganization">Issuing Organization *</Label>
                <Input
                  id="issuingOrganization"
                  value={formData.issuingOrganization}
                  onChange={(e) => updateField('issuingOrganization', e.target.value)}
                  className={errors.issuingOrganization ? 'border-red-500' : ''}
                  placeholder="e.g., Amazon Web Services"
                />
                {errors.issuingOrganization && (
                  <p className="text-sm text-red-600">{errors.issuingOrganization}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Brief description of the certification..."
                rows={3}
              />
            </div>
          </div>

          {/* Categories and Levels */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Classification</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value: CertificationCategory) => updateField('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select value={formData.level} onValueChange={(value: CertificationLevel) => updateField('level', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dates</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date *</Label>
                <div className="relative">
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => updateField('issueDate', e.target.value)}
                    className={cn(errors.issueDate ? 'border-red-500' : '', 'pr-10')}
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                {errors.issueDate && (
                  <p className="text-sm text-red-600">{errors.issueDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <div className="relative">
                  <Input
                    id="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => updateField('expirationDate', e.target.value)}
                    className={cn(errors.expirationDate ? 'border-red-500' : '', 'pr-10')}
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                {errors.expirationDate && (
                  <p className="text-sm text-red-600">{errors.expirationDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Status and Verification */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Status</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: CertificationStatus) => updateField('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verificationStatus">Verification Status</Label>
                <Select value={formData.verificationStatus} onValueChange={(value: VerificationStatus) => updateField('verificationStatus', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {verificationStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Credential Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Credential Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credentialId">Credential ID</Label>
                <Input
                  id="credentialId"
                  value={formData.credentialId}
                  onChange={(e) => updateField('credentialId', e.target.value)}
                  placeholder="e.g., AWS-SAA-001234"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={formData.logo}
                  onChange={(e) => updateField('logo', e.target.value)}
                  className={errors.logo ? 'border-red-500' : ''}
                  placeholder="https://example.com/logo.png"
                />
                {errors.logo && (
                  <p className="text-sm text-red-600">{errors.logo}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialUrl">Credential URL</Label>
              <Input
                id="credentialUrl"
                value={formData.credentialUrl}
                onChange={(e) => updateField('credentialUrl', e.target.value)}
                className={errors.credentialUrl ? 'border-red-500' : ''}
                placeholder="https://credly.com/badges/..."
              />
              {errors.credentialUrl && (
                <p className="text-sm text-red-600">{errors.credentialUrl}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : certification ? 'Update Certification' : 'Add Certification'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}