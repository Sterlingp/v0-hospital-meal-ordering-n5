'use client'

import { cn } from '@/lib/utils'
import type { MenuItem, DietType } from '@/lib/types'
import { getBlockingAllergenConflicts, hasRenalRestriction } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Check, AlertTriangle, Ban, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { ENTREE_OPTIONS } from '@/lib/types'

interface MenuItemCardProps {
  item: MenuItem
  isSelected: boolean
  onSelect: () => void
  patientAllergies?: string[]
  patientDietType?: DietType
  disabled?: boolean
}

export function MenuItemCard({
  item,
  isSelected,
  onSelect,
  patientAllergies = [],
  patientDietType,
  disabled = false,
}: MenuItemCardProps) {
  const blockingAllergenConflicts = getBlockingAllergenConflicts(item, patientAllergies)
  const hasAllergenWarning = blockingAllergenConflicts.length > 0
  
  // Check for renal diet restrictions
  const hasRenalWarning = patientDietType === 'renal' && hasRenalRestriction(item.name, item.description)
  
  // Check if this item has configurable options
  const hasOptions = !!ENTREE_OPTIONS[item.name]
  
  return (
    <Card
      className={cn(
        'relative cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg',
        isSelected && 'ring-4 ring-primary shadow-lg',
        hasAllergenWarning && 'ring-2 ring-destructive',
        hasRenalWarning && !hasAllergenWarning && 'ring-2 ring-amber-500',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      onClick={() => !disabled && onSelect()}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg sm:right-3 sm:top-3 sm:h-8 sm:w-8">
          <Check className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      )}
      
      {/* Allergen warning */}
      {hasAllergenWarning && !isSelected && (
        <div className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg sm:right-3 sm:top-3 sm:h-8 sm:w-8">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      )}
      
      {/* Renal restriction warning */}
      {hasRenalWarning && !hasAllergenWarning && !isSelected && (
        <div className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg sm:right-3 sm:top-3 sm:h-8 sm:w-8">
          <Ban className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      )}
      
      {/* Image */}
      <div className="relative aspect-[4/3] w-full bg-muted">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary/20">
            <span className="text-6xl font-thin text-secondary-foreground/20 select-none">
              {item.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-card-foreground sm:text-xl">{item.name}</h3>
          {hasOptions && !isSelected && (
            <span className="shrink-0 flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary whitespace-nowrap">
              Options <ChevronRight className="h-3 w-3" />
            </span>
          )}
        </div>
        
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        )}
        
        
        {/* Renal restriction notice */}
        {hasRenalWarning && (
          <div className="mt-2 flex items-center gap-1.5 rounded bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
            <Ban className="h-3 w-3" />
            <span>Renal diet restriction</span>
          </div>
        )}
        
        {/* Allergen list */}
        {item.allergens.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.allergens.map((allergen) => (
              <span
                key={allergen}
                className={cn(
                  'rounded px-1.5 py-0.5 text-xs font-medium',
                  blockingAllergenConflicts.some(
                    (conflict) => conflict.toLowerCase() === allergen.toLowerCase()
                  )
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {allergen}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
