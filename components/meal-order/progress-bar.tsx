'use client'

import { cn } from '@/lib/utils'
import { ORDER_STEPS, STEP_LABELS, type OrderStep } from '@/lib/types'
import { Check } from 'lucide-react'

interface ProgressBarProps {
  currentStep: OrderStep
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const currentIndex = ORDER_STEPS.indexOf(currentStep)
  
  return (
    <div className="w-full py-4 sm:py-6">
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max items-center justify-between gap-3 sm:min-w-0 sm:gap-0">
        {ORDER_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = index > currentIndex
          
          return (
            <div key={step} className="flex min-w-[84px] flex-1 items-center sm:min-w-0">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold transition-all duration-300 sm:h-12 sm:w-12 sm:text-lg',
                    isCompleted && 'bg-success text-success-foreground',
                    isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                    isUpcoming && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    'text-center text-xs font-medium transition-colors sm:text-sm',
                    isCurrent && 'text-primary',
                    isCompleted && 'text-success',
                    isUpcoming && 'text-muted-foreground'
                  )}
                >
                  {STEP_LABELS[step]}
                </span>
              </div>
              
              {index < ORDER_STEPS.length - 1 && (
                <div className="mx-2 h-1 min-w-6 flex-1 sm:min-w-0">
                  <div
                    className={cn(
                      'h-full rounded-full transition-colors duration-300',
                      index < currentIndex ? 'bg-success' : 'bg-muted'
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
        </div>
      </div>
    </div>
  )
}
