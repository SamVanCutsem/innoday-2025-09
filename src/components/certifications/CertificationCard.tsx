"use client"

import * as React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CertificationBadge } from "./CertificationBadge"
import { cn } from "@/lib/utils"
import {
  ExternalLink,
  Calendar,
  Building2,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Certification } from "@/types"

interface CertificationCardProps {
  certification: Certification
  className?: string
  variant?: 'compact' | 'detailed'
  onEdit?: (certification: Certification) => void
  onDelete?: (certification: Certification) => void
  onDuplicate?: (certification: Certification) => void
}

export function CertificationCard({
  certification,
  className,
  variant = 'detailed',
  onEdit,
  onDelete,
  onDuplicate
}: CertificationCardProps) {
  const isExpiringSoon = certification.status === 'expiring_soon'
  const isExpired = certification.status === 'expired'
  const isActive = certification.status === 'active'

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const getDaysUntilExpiration = () => {
    if (!certification.expirationDate) return null
    const today = new Date()
    const expiration = new Date(certification.expirationDate)
    const diffTime = expiration.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilExpiration = getDaysUntilExpiration()

  if (variant === 'compact') {
    return (
      <Card className={cn(
        "transition-all hover:shadow-md",
        isExpired && "opacity-75 border-red-200",
        isExpiringSoon && "border-amber-200 bg-amber-50/30",
        className
      )}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-sm truncate">{certification.name}</h3>
                <CertificationBadge variant="status" value={certification.status} />
              </div>
              <p className="text-xs text-muted-foreground mb-1">{certification.issuingOrganization}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Issued: {formatDate(certification.issueDate)}</span>
                {certification.expirationDate && (
                  <span>Expires: {formatDate(certification.expirationDate)}</span>
                )}
              </div>
            </div>
            {(onEdit || onDelete || onDuplicate) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(certification)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDuplicate && (
                    <DropdownMenuItem onClick={() => onDuplicate(certification)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                  )}
                  {(onEdit || onDuplicate) && onDelete && <DropdownMenuSeparator />}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(certification)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(
      "transition-all hover:shadow-lg",
      isExpired && "opacity-75 border-red-200",
      isExpiringSoon && "border-amber-200 bg-amber-50/30",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">{certification.name}</h3>
              {certification.logo && (
                <img
                  src={certification.logo}
                  alt={`${certification.issuingOrganization} logo`}
                  className="h-6 w-6 object-contain"
                />
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{certification.issuingOrganization}</span>
            </div>
          </div>
          {(onEdit || onDelete || onDuplicate) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(certification)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem onClick={() => onDuplicate(certification)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                )}
                {(onEdit || onDuplicate) && onDelete && <DropdownMenuSeparator />}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(certification)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status and Verification Badges */}
        <div className="flex flex-wrap gap-2">
          <CertificationBadge variant="status" value={certification.status} />
          <CertificationBadge variant="verification" value={certification.verificationStatus} />
          <CertificationBadge variant="level" value={certification.level} showIcon={false} />
          <CertificationBadge variant="category" value={certification.category} showIcon={false} />
        </div>

        {/* Expiration Warning */}
        {isExpiringSoon && daysUntilExpiration && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <p className="text-sm text-amber-800">
              <strong>Expiring soon:</strong> This certification expires in {daysUntilExpiration} days
            </p>
          </div>
        )}

        {/* Description */}
        {certification.description && (
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </h4>
            <p className="text-sm text-muted-foreground">{certification.description}</p>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Issue Date
            </h4>
            <p className="text-sm text-muted-foreground">{formatDate(certification.issueDate)}</p>
          </div>
          {certification.expirationDate && (
            <div>
              <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Expiration Date
              </h4>
              <p className={cn(
                "text-sm",
                isExpired ? "text-red-600" :
                isExpiringSoon ? "text-amber-600" :
                "text-muted-foreground"
              )}>
                {formatDate(certification.expirationDate)}
                {daysUntilExpiration !== null && isActive && (
                  <span className="ml-2 text-xs">
                    ({daysUntilExpiration > 0 ? `${daysUntilExpiration} days left` : 'Expired'})
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Credential Info */}
        {certification.credentialId && (
          <div>
            <h4 className="font-medium text-sm mb-1">Credential ID</h4>
            <code className="text-xs bg-muted px-2 py-1 rounded">{certification.credentialId}</code>
          </div>
        )}
      </CardContent>

      {certification.credentialUrl && (
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a
              href={certification.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Credential
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}