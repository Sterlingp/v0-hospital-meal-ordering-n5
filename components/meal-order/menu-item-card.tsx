'use client'

import { cn } from '@/lib/utils'
import type { MenuItem, DietType } from '@/lib/types'
import { hasRenalRestriction } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Check, AlertTriangle, Ban } from 'lucide-react'
import Image from 'next/image'

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
  const hasAllergenWarning = item.allergens.some((allergen) =>
    patientAllergies.some(
      (pa) => pa.toLowerCase() === allergen.toLowerCase()
    )
  )
  
  // Check for renal diet restrictions
  const hasRenalWarning = patientDietType === 'renal' && hasRenalRestriction(item.name, item.description)
  
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
        <div className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
          <Check className="h-5 w-5" />
        </div>
      )}
      
      {/* Allergen warning */}
      {hasAllergenWarning && !isSelected && (
        <div className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg">
          <AlertTriangle className="h-5 w-5" />
        </div>
      )}
      
      {/* Renal restriction warning */}
      {hasRenalWarning && !hasAllergenWarning && !isSelected && (
        <div className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg">
          <Ban className="h-5 w-5" />
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
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <span className="text-4xl">
              {item.category === 'entree' && '🍽️'}
              {item.category === 'side' && '🥗'}
              {item.category === 'beverage' && '🥤'}
              {item.category === 'dessert' && '🍰'}
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold text-card-foreground">{item.name}</h3>
        
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
                  patientAllergies.some(
                    (pa) => pa.toLowerCase() === allergen.toLowerCase()
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
