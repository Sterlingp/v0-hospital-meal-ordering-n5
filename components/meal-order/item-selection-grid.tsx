'use client'

import type { MenuItem, ItemCategory, DietType } from '@/lib/types'
import { MenuItemCard } from './menu-item-card'
import { CATEGORY_LABELS } from '@/lib/types'

interface ItemSelectionGridProps {
  items: MenuItem[]
  category: ItemCategory
  selectedItems: MenuItem[]
  onSelect: (item: MenuItem) => void
  maxSelections?: number
  patientAllergies?: string[]
  patientDietType?: DietType
}

export function ItemSelectionGrid({
  items,
  category,
  selectedItems,
  onSelect,
  maxSelections = 1,
  patientAllergies = [],
  patientDietType,
}: ItemSelectionGridProps) {
  const filteredItems = items.filter((item) => item.category === category)
  const isMaxSelected = selectedItems.length >= maxSelections
  
  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-xl text-muted-foreground">
          No {CATEGORY_LABELS[category].toLowerCase()} items available for your diet.
        </p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => {
          const isSelected = selectedItems.some((s) => s.id === item.id)
          const disabled = !isSelected && isMaxSelected
          
          return (
            <MenuItemCard
              key={item.id}
              item={item}
              isSelected={isSelected}
              onSelect={() => onSelect(item)}
              patientAllergies={patientAllergies}
              patientDietType={patientDietType}
              disabled={disabled}
            />
          )
        })}
    </div>
  )
}
