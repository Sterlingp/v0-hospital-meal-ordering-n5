'use client'

import type { MealSelection, MealType, MenuItem } from '@/lib/types'
import { MEAL_LABELS, ENTREE_OPTIONS } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface OrderReviewProps {
  mealType: MealType
  selection: MealSelection
  specialRequests: string
  onSpecialRequestsChange: (value: string) => void
}

interface ReviewItem {
  label: string
  item: MenuItem
  optionsText?: string
}

export function OrderReview({
  mealType,
  selection,
  specialRequests,
  onSpecialRequestsChange,
}: OrderReviewProps) {
  const items: ReviewItem[] = []
  
  // Add entree with options
  if (selection.entree) {
    // Format options as a string
    let optionsText = ''
    const entreeConfig = ENTREE_OPTIONS[selection.entree.name]
    if (entreeConfig && Object.keys(selection.entreeOptions).length > 0) {
      const optionLabels: string[] = []
      entreeConfig.forEach((option) => {
        const value = selection.entreeOptions[option.id]
        if (value) {
          if (Array.isArray(value)) {
            value.forEach((v) => {
              const choice = option.choices.find((c) => c.value === v)
              if (choice) optionLabels.push(choice.label)
            })
          } else {
            const choice = option.choices.find((c) => c.value === value)
            if (choice) optionLabels.push(choice.label)
          }
        }
      })
      if (optionLabels.length > 0) {
        optionsText = ` (${optionLabels.join(', ')})`
      }
    }
    items.push({ label: 'Entree', item: selection.entree, optionsText })
  }
  
  // Add soup
  if (selection.soup) {
    items.push({ label: 'Soup', item: selection.soup })
  }
  
  // Add salad
  if (selection.salad) {
    items.push({ label: 'Salad', item: selection.salad })
  }
  
  // Add salad dressing
  if (selection.saladDressing) {
    items.push({ label: 'Dressing', item: selection.saladDressing })
  }
  
  // Add salad add-ons
  selection.saladAddons.forEach((addon) => {
    items.push({ label: 'Salad Add-on', item: addon })
  })
  
  // Add vegetable
  if (selection.vegetable) {
    items.push({ label: 'Vegetable', item: selection.vegetable })
  }
  
  // Add starch
  if (selection.starch) {
    items.push({ label: 'Starch', item: selection.starch })
  }
  
  // Add condiments
  selection.condiments.forEach((condiment) => {
    items.push({ label: 'Condiment', item: condiment })
  })
  
  // Add beverage
  if (selection.beverage) {
    items.push({ label: 'Beverage', item: selection.beverage })
  }
  
  // Add beverage add-ons
  selection.beverageAddons.forEach((addon) => {
    items.push({ label: 'Add-on', item: addon })
  })
  
  // Add dessert
  if (selection.dessert) {
    items.push({ label: 'Dessert', item: selection.dessert })
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Your {MEAL_LABELS[mealType]} Order
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map(({ label, item, optionsText }, index) => (
            <div key={`${item.id}-${index}`}>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {label}
                  </p>
                  <p className="text-lg font-semibold text-card-foreground">
                    {item.name}
                    {optionsText && (
                      <span className="ml-2 text-base font-normal text-muted-foreground">
                        {optionsText}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {index < items.length - 1 && <Separator />}
            </div>
          ))}
          
          {items.length === 0 && (
            <p className="py-4 text-center text-muted-foreground">
              No items selected
            </p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Special Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="special-requests" className="sr-only">
              Special requests or dietary notes
            </Label>
            <Textarea
              id="special-requests"
              placeholder="Any special requests or dietary notes? (optional)"
              value={specialRequests}
              onChange={(e) => onSpecialRequestsChange(e.target.value)}
              className="min-h-[120px] text-lg"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
