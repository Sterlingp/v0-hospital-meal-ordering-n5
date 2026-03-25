'use client'

import type { MealSelection, MealType } from '@/lib/types'
import { MEAL_LABELS, CATEGORY_LABELS } from '@/lib/types'
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

export function OrderReview({
  mealType,
  selection,
  specialRequests,
  onSpecialRequestsChange,
}: OrderReviewProps) {
  const items = [
    { label: CATEGORY_LABELS.entree, item: selection.entree },
    ...selection.sides.map((side, index) => ({
      label: `${CATEGORY_LABELS.side} ${index + 1}`,
      item: side,
    })),
    { label: CATEGORY_LABELS.beverage, item: selection.beverage },
    { label: CATEGORY_LABELS.dessert, item: selection.dessert },
  ].filter((i) => i.item !== null)
  
  const totalCalories = items.reduce(
    (sum, { item }) => sum + (item?.calories || 0),
    0
  )
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Your {MEAL_LABELS[mealType]} Order
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map(({ label, item }, index) => (
            <div key={index}>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {label}
                  </p>
                  <p className="text-lg font-semibold text-card-foreground">
                    {item?.name}
                  </p>
                </div>
                {item?.calories && (
                  <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                    {item.calories} cal
                  </span>
                )}
              </div>
              {index < items.length - 1 && <Separator />}
            </div>
          ))}
          
          <Separator className="my-4" />
          
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total Calories</span>
            <span className="rounded-full bg-primary px-4 py-1 text-primary-foreground">
              {totalCalories} cal
            </span>
          </div>
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
