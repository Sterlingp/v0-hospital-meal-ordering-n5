'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Patient, MenuItem, MealType, MealSelection, OrderStep } from '@/lib/types'
import { ORDER_STEPS, STEP_LABELS } from '@/lib/types'
import { ProgressBar } from './progress-bar'
import { MealTypeSelector } from './meal-type-selector'
import { ItemSelectionGrid } from './item-selection-grid'
import { OrderReview } from './order-review'
import { Button } from '@/components/ui/button'
import { getMenuItemsForMeal, submitOrder } from '@/app/actions/meals'
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OrderWizardProps {
  patient: Patient
}

export function OrderWizard({ patient }: OrderWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OrderStep>('meal')
  const [mealType, setMealType] = useState<MealType | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selection, setSelection] = useState<MealSelection>({
    entree: null,
    sides: [],
    beverage: null,
    dessert: null,
  })
  const [specialRequests, setSpecialRequests] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Fetch menu items when meal type is selected
  useEffect(() => {
    if (mealType) {
      setIsLoading(true)
      getMenuItemsForMeal(mealType, patient.diet_type)
        .then(setMenuItems)
        .finally(() => setIsLoading(false))
    }
  }, [mealType, patient.diet_type])
  
  const currentStepIndex = ORDER_STEPS.indexOf(currentStep)
  
  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case 'meal':
        return mealType !== null
      case 'entree':
        return selection.entree !== null
      case 'sides':
        return selection.sides.length > 0
      case 'beverage':
        return selection.beverage !== null
      case 'dessert':
        return true // Dessert is optional
      case 'review':
        return true
      default:
        return false
    }
  }, [currentStep, mealType, selection])
  
  const goToNextStep = () => {
    if (currentStepIndex < ORDER_STEPS.length - 1) {
      setCurrentStep(ORDER_STEPS[currentStepIndex + 1])
    }
  }
  
  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(ORDER_STEPS[currentStepIndex - 1])
    }
  }
  
  const handleMealSelect = (meal: MealType) => {
    setMealType(meal)
    // Reset selections when changing meal type
    setSelection({
      entree: null,
      sides: [],
      beverage: null,
      dessert: null,
    })
    // Auto-continue to next step
    setTimeout(() => setCurrentStep('entree'), 300)
  }
  
  const handleEntreeSelect = (item: MenuItem) => {
    const isDeselecting = selection.entree?.id === item.id
    setSelection((prev) => ({
      ...prev,
      entree: isDeselecting ? null : item,
    }))
    // Auto-continue if selecting (not deselecting)
    if (!isDeselecting) {
      setTimeout(() => setCurrentStep('sides'), 300)
    }
  }
  
  const handleSideSelect = (item: MenuItem) => {
    setSelection((prev) => {
      const isSelected = prev.sides.some((s) => s.id === item.id)
      if (isSelected) {
        return { ...prev, sides: prev.sides.filter((s) => s.id !== item.id) }
      }
      if (prev.sides.length >= 2) {
        return prev // Max 2 sides
      }
      const newSides = [...prev.sides, item]
      // Auto-continue when 2 sides are selected
      if (newSides.length === 2) {
        setTimeout(() => setCurrentStep('beverage'), 300)
      }
      return { ...prev, sides: newSides }
    })
  }
  
  const handleBeverageSelect = (item: MenuItem) => {
    const isDeselecting = selection.beverage?.id === item.id
    setSelection((prev) => ({
      ...prev,
      beverage: isDeselecting ? null : item,
    }))
    // Auto-continue if selecting (not deselecting)
    if (!isDeselecting) {
      setTimeout(() => setCurrentStep('dessert'), 300)
    }
  }
  
  const handleDessertSelect = (item: MenuItem) => {
    const isDeselecting = selection.dessert?.id === item.id
    setSelection((prev) => ({
      ...prev,
      dessert: isDeselecting ? null : item,
    }))
    // Auto-continue if selecting (not deselecting)
    if (!isDeselecting) {
      setTimeout(() => setCurrentStep('review'), 300)
    }
  }
  
  const handleSubmit = async () => {
    if (!mealType) return
    
    setIsSubmitting(true)
    try {
      const result = await submitOrder(
        patient.id,
        mealType,
        selection,
        specialRequests || null
      )
      
      if (result.success) {
        router.push(`/order/${patient.id}/confirmation?orderId=${result.orderId}`)
      } else {
        alert(result.error || 'Failed to submit order')
      }
    } catch {
      alert('An error occurred while submitting your order')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Loading menu items...</p>
        </div>
      )
    }
    
    switch (currentStep) {
      case 'meal':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Which meal would you like to order?
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Select a meal time to view available options
              </p>
            </div>
            <MealTypeSelector
              selectedMeal={mealType}
              onSelect={handleMealSelect}
            />
          </div>
        )
      
      case 'entree':
        return (
          <ItemSelectionGrid
            items={menuItems}
            category="entree"
            selectedItems={selection.entree ? [selection.entree] : []}
            onSelect={handleEntreeSelect}
            maxSelections={1}
            patientAllergies={patient.allergies}
          />
        )
      
      case 'sides':
        return (
          <ItemSelectionGrid
            items={menuItems}
            category="side"
            selectedItems={selection.sides}
            onSelect={handleSideSelect}
            maxSelections={2}
            patientAllergies={patient.allergies}
          />
        )
      
      case 'beverage':
        return (
          <ItemSelectionGrid
            items={menuItems}
            category="beverage"
            selectedItems={selection.beverage ? [selection.beverage] : []}
            onSelect={handleBeverageSelect}
            maxSelections={1}
            patientAllergies={patient.allergies}
          />
        )
      
      case 'dessert':
        return (
          <ItemSelectionGrid
            items={menuItems}
            category="dessert"
            selectedItems={selection.dessert ? [selection.dessert] : []}
            onSelect={handleDessertSelect}
            maxSelections={1}
            patientAllergies={patient.allergies}
          />
        )
      
      case 'review':
        return mealType ? (
          <OrderReview
            mealType={mealType}
            selection={selection}
            specialRequests={specialRequests}
            onSpecialRequestsChange={setSpecialRequests}
          />
        ) : null
      
      default:
        return null
    }
  }
  
  return (
    <div className="flex min-h-[calc(100vh-88px)] flex-col">
      <div className="border-b bg-card px-6">
        <ProgressBar currentStep={currentStep} />
      </div>
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl">
          {renderStepContent()}
        </div>
      </main>
      
      <footer className="border-t bg-card p-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0}
            className="gap-2 text-lg"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </Button>
          
          <p className="text-muted-foreground">
            Step {currentStepIndex + 1} of {ORDER_STEPS.length}: {STEP_LABELS[currentStep]}
          </p>
          
          {currentStep === 'review' ? (
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2 bg-success text-lg text-success-foreground hover:bg-success/90"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Check className="h-5 w-5" />
              )}
              Submit Order
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={goToNextStep}
              disabled={!canProceed()}
              className="gap-2 text-lg"
            >
              Continue
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}
