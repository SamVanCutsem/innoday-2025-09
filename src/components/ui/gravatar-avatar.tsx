"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { generateGravatarUrl, generateAvatarFallback, type GravatarOptions } from "@/lib/gravatar"
import { cn } from "@/lib/utils"

export interface GravatarAvatarProps {
  email?: string
  firstName?: string
  lastName?: string
  avatar?: string
  size?: number
  className?: string
  gravatarOptions?: Omit<GravatarOptions, 'size'>
}

export const GravatarAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  GravatarAvatarProps
>(({
  email,
  firstName,
  lastName,
  avatar,
  size = 40,
  className,
  gravatarOptions = {},
  ...props
}, ref) => {
  const [imageError, setImageError] = React.useState(false)
  const [gravatarError, setGravatarError] = React.useState(false)

  const gravatarUrl = React.useMemo(() => {
    if (!email) return null
    return generateGravatarUrl(email, { size, ...gravatarOptions })
  }, [email, size, gravatarOptions])

  const fallbackText = React.useMemo(() =>
    generateAvatarFallback(firstName, lastName, email),
    [firstName, lastName, email]
  )

  const handleImageError = () => {
    setImageError(true)
  }

  const handleGravatarError = () => {
    setGravatarError(true)
  }

  const imageSource = React.useMemo(() => {
    if (avatar && !imageError) return avatar
    if (gravatarUrl && !gravatarError) return gravatarUrl
    return null
  }, [avatar, imageError, gravatarUrl, gravatarError])

  return (
    <Avatar
      ref={ref}
      className={cn(`h-[${size}px] w-[${size}px]`, className)}
      {...props}
    >
      {imageSource && (
        <AvatarImage
          src={imageSource}
          alt={`${firstName} ${lastName}`.trim() || email || 'Avatar'}
          onError={avatar && !imageError ? handleImageError : handleGravatarError}
        />
      )}
      <AvatarFallback
        className={cn(
          "text-xs font-medium",
          size <= 32 && "text-xs",
          size <= 24 && "text-[10px]",
          size >= 48 && "text-sm"
        )}
      >
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  )
})

GravatarAvatar.displayName = "GravatarAvatar"