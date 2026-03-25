'use client'

import { cn } from '@/lib/utils'
import type { MealType } from '@/lib/types'
import { MEAL_LABELS } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Sun, Utensils, Moon } from 'lucide-react'

interface MealTypeSelectorProps {
  selectedMeal: MealType | null
  onSelect: (meal: MealType) => void
}

const MEAL_ICONS: Record<MealType, React.ReactNode> = {
  breakfast: <Sun className="h-16 w-16" />,
  lunch: <Utensils className="h-16 w-16" />,
  dinner: <Moon className="h-16 w-16" />,
}

const MEAL_TIMES: Record<MealType, string> = {
  breakfast: '7:00 - 9:00 AM',
  lunch: '11:30 AM - 1:30 PM',
  dinner: '5:00 - 7:00 PM',
}

export function MealTypeSelector({ selectedMeal, onSelect }: MealTypeSelectorProps) {
  const meals: MealType[] = ['breakfast', 'lunch', 'dinner']
  
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {meals.map((meal) => (
        <Card
          key={meal}
          className={cn(
            'cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]',
            selectedMeal === meal && 'ring-4 ring-primary shadow-xl scale-[1.02]'
          )}
          onClick={() => onSelect(meal)}
        >
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div
              className={cn(
                'mb-4 rounded-full p-6 transition-colors',
                selectedMeal === meal
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              )}
            >
              {MEAL_ICONS[meal]}
            </div>
            <h3 className="text-2xl font-bold text-card-foreground">
              {MEAL_LABELS[meal]}
            </h3>
            <p className="mt-2 text-muted-foreground">{MEAL_TIMES[meal]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
