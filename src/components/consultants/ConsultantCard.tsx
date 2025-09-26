'use client';

import Link from 'next/link';
import { Mail, Phone, Calendar, Award, MoreHorizontal, Briefcase } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface ConsultantCardProps {
  consultant: Consultant;
  onEdit?: (consultant: Consultant) => void;
  onDelete?: (consultant: Consultant) => void;
  onAvailabilityChange?: (consultant: Consultant, availability: Consultant['availability']) => void;
  className?: string;
}

const availabilityConfig = {
  available: { color: 'bg-green-500', label: 'Available', variant: 'default' as const },
  busy: { color: 'bg-yellow-500', label: 'Busy', variant: 'secondary' as const },
  unavailable: { color: 'bg-red-500', label: 'Unavailable', variant: 'destructive' as const },
};

export default function ConsultantCard({
  consultant,
  onEdit,
  onDelete,
  onAvailabilityChange,
  className
}: ConsultantCardProps) {
  const availability = availabilityConfig[consultant.availability];
  const initials = `${consultant.firstName.charAt(0)}${consultant.lastName.charAt(0)}`;

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={consultant.avatar} alt={`${consultant.firstName} ${consultant.lastName}`} />
              <AvatarFallback className="text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Link href={`/consultants/${consultant.id}`}>
                <h3 className="font-semibold text-lg hover:text-primary cursor-pointer truncate">
                  {consultant.firstName} {consultant.lastName}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground truncate">
                {consultant.title}
              </p>
              {consultant.department && (
                <p className="text-xs text-muted-foreground">
                  {consultant.department}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={availability.variant} className="text-xs">
              <div className={cn('w-2 h-2 rounded-full mr-1', availability.color)} />
              {availability.label}
            </Badge>
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
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="mr-2 h-4 w-4" />
            <span className="truncate">{consultant.email}</span>
          </div>
          {consultant.phone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="mr-2 h-4 w-4" />
              <span>{consultant.phone}</span>
            </div>
          )}
        </div>

        {/* Experience and Skills */}
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{consultant.experience} years experience</span>
          </div>

          {/* Top Skills */}
          {consultant.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {consultant.skills.slice(0, 3).map((skill) => (
                <Badge
                  key={skill.id}
                  variant="outline"
                  className="text-xs"
                  style={{ borderColor: skill.color, color: skill.color }}
                >
                  {skill.name}
                </Badge>
              ))}
              {consultant.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{consultant.skills.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Certifications */}
        {consultant.certifications.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Award className="mr-2 h-4 w-4" />
              <span className="font-medium">Certifications</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {consultant.certifications.slice(0, 2).join(', ')}
              {consultant.certifications.length > 2 && ' +' + (consultant.certifications.length - 2) + ' more'}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span>Joined {consultant.createdAt.toLocaleDateString()}</span>
          </div>
          <Link href={`/consultants/${consultant.id}`}>
            <Button variant="outline" size="sm">
              View Profile
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}