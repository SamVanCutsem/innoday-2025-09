"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Shield,
  ShieldCheck,
  ShieldX,
  Loader2
} from "lucide-react"
import {
  CertificationStatus,
  VerificationStatus,
  CertificationLevel,
  CertificationCategory
} from "@/types"

interface CertificationBadgeProps {
  variant: 'status' | 'verification' | 'level' | 'category'
  value: CertificationStatus | VerificationStatus | CertificationLevel | CertificationCategory
  className?: string
  showIcon?: boolean
}

const statusConfig = {
  active: {
    variant: "default" as const,
    icon: CheckCircle,
    className: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300"
  },
  expired: {
    variant: "destructive" as const,
    icon: XCircle,
    className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300"
  },
  expiring_soon: {
    variant: "outline" as const,
    icon: AlertTriangle,
    className: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-300"
  },
  revoked: {
    variant: "destructive" as const,
    icon: XCircle,
    className: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-300"
  }
}

const verificationConfig = {
  verified: {
    variant: "default" as const,
    icon: ShieldCheck,
    className: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-300"
  },
  pending: {
    variant: "outline" as const,
    icon: Loader2,
    className: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300"
  },
  unverified: {
    variant: "secondary" as const,
    icon: Shield,
    className: "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400"
  },
  failed: {
    variant: "destructive" as const,
    icon: ShieldX,
    className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300"
  }
}

const levelConfig = {
  foundational: {
    variant: "secondary" as const,
    className: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300"
  },
  associate: {
    variant: "outline" as const,
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
  },
  professional: {
    variant: "default" as const,
    className: "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900 dark:text-indigo-300"
  },
  expert: {
    variant: "default" as const,
    className: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-300"
  },
  specialist: {
    variant: "default" as const,
    className: "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900 dark:text-pink-300"
  }
}

const categoryConfig = {
  cloud: {
    variant: "outline" as const,
    className: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300"
  },
  development: {
    variant: "outline" as const,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
  },
  security: {
    variant: "outline" as const,
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300"
  },
  data: {
    variant: "outline" as const,
    className: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300"
  },
  devops: {
    variant: "outline" as const,
    className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300"
  },
  management: {
    variant: "outline" as const,
    className: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300"
  },
  design: {
    variant: "outline" as const,
    className: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300"
  },
  other: {
    variant: "secondary" as const,
    className: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-850 dark:text-gray-300"
  }
}

export function CertificationBadge({
  variant,
  value,
  className,
  showIcon = true
}: CertificationBadgeProps) {
  const getConfig = () => {
    switch (variant) {
      case 'status':
        return statusConfig[value as CertificationStatus]
      case 'verification':
        return verificationConfig[value as VerificationStatus]
      case 'level':
        return levelConfig[value as CertificationLevel]
      case 'category':
        return categoryConfig[value as CertificationCategory]
      default:
        return { variant: "secondary" as const, className: "" }
    }
  }

  const config = getConfig()
  const Icon = variant === 'status' ? statusConfig[value as CertificationStatus]?.icon :
              variant === 'verification' ? verificationConfig[value as VerificationStatus]?.icon :
              null

  const displayValue = value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium transition-colors",
        config.className,
        className
      )}
    >
      {showIcon && Icon && (
        <Icon
          className={cn(
            "h-3 w-3",
            variant === 'verification' && value === 'pending' && "animate-spin"
          )}
        />
      )}
      {displayValue}
    </Badge>
  )
}