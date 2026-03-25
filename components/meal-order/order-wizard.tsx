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

// Cache for preloaded menu items by meal type
type MenuCache = {
  breakfast: MenuItem[]
  lunch: MenuItem[]
  dinner: MenuItem[]
}

export function OrderWizard({ patient }: OrderWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OrderStep>('meal')
  const [mealType, setMealType] = useState<MealType | null>(null)
  const [menuCache, setMenuCache] = useState<MenuCache>({ breakfast: [], lunch: [], dinner: [] })
  const [selection, setSelection] = useState<MealSelection>({
    entree: null,
    soup: null,
    salad: null,
    vegetable: null,
    starch: null,
    condiments: [],
    seasonings: [],
    beverage: null,
    dessert: null,
  })
  const [specialRequests, setSpecialRequests] = useState('')
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Preload ALL meal types on mount so there's no loading when selecting meals
  useEffect(() => {
    async function preloadAllMeals() {
      setIsInitialLoading(true)
      try {
        const [breakfast, lunch, dinner] = await Promise.all([
          getMenuItemsForMeal('breakfast', patient.diet_type),
          getMenuItemsForMeal('lunch', patient.diet_type),
          getMenuItemsForMeal('dinner', patient.diet_type),
        ])
        setMenuCache({ breakfast, lunch, dinner })
      } catch (error) {
        console.error('Error preloading menus:', error)
      } finally {
        setIsInitialLoading(false)
      }
    }
    preloadAllMeals()
  }, [patient.diet_type])
  
  // Get menu items for current meal type from cache
  const menuItems = mealType ? menuCache[mealType] : []
  
  const currentStepIndex = ORDER_STEPS.indexOf(currentStep)
  
  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case 'meal':
        return mealType !== null // User clicks a meal card which auto-advances
      case 'entree':
        return selection.entree !== null || selection.soup !== null || selection.salad !== null
      case 'sides':
        return true // Sides are optional - can skip
      case 'condiments':
        return true // Condiments are optional
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
      soup: null,
      salad: null,
      vegetable: null,
      starch: null,
      condiments: [],
      seasonings: [],
      beverage: null,
      dessert: null,
    })
    // Auto-advance to entree selection
    setCurrentStep('entree')
  }
  
  const handleEntreeSelect = (item: MenuItem) => {
    setSelection((prev) => ({
      ...prev,
      entree: prev.entree?.id === item.id ? null : item,
    }))
  }
  
  const handleSoupSelect = (item: MenuItem) => {
    setSelection((prev) => ({
      ...prev,
      soup: prev.soup?.id === item.id ? null : item,
    }))
  }
  
  const handleSaladSelect = (item: MenuItem) => {
    setSelection((prev) => ({
      ...prev,
      salad: prev.salad?.id === item.id ? null : item,
    }))
  }
  
  const handleVegetableSelect = (item: MenuItem) => {
    setSelection((prev) => ({
      ...prev,
      vegetable: prev.vegetable?.id === item.id ? null : item,
    }))
  }
  
  const handleStarchSelect = (item: MenuItem) => {
    setSelection((prev) => ({
      ...prev,
      starch: prev.starch?.id === item.id ? null : item,
    }))
  }
  
  const handleCondimentSelect = (item: MenuItem) => {
    setSelection((prev) => {
      const isSelected = prev.condiments.some((c) => c.id === item.id)
      if (isSelected) {
        return { ...prev, condiments: prev.condiments.filter((c) => c.id !== item.id) }
      }
      return { ...prev, condiments: [...prev.condiments, item] }
    })
  }
  
  const handleSeasoningSelect = (item: MenuItem) => {
    setSelection((prev) => {
      const isSelected = prev.seasonings.some((s) => s.id === item.id)
      if (isSelected) {
        return { ...prev, seasonings: prev.seasonings.filter((s) => s.id !== item.id) }
      }
      return { ...prev, seasonings: [...prev.seasonings, item] }
    })
  }
  
  const handleBeverageSelect = (item: MenuItem) => {
    setSelection((prev) => ({
      ...prev,
      beverage: prev.beverage?.id === item.id ? null : item,
    }))
  }
  
  const handleDessertSelect = (item: MenuItem) => {
    setSelection((prev) => ({
      ...prev,
      dessert: prev.dessert?.id === item.id ? null : item,
    }))
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
  
  // Filter items by category
  const entrees = menuItems.filter(item => item.category === 'entree')
  const soups = menuItems.filter(item => item.category === 'soup')
  const salads = menuItems.filter(item => item.category === 'salad')
  const vegetables = menuItems.filter(item => item.category === 'vegetable' || (item.category === 'side' && item.name.toLowerCase().includes('carrot') || item.name.toLowerCase().includes('broccoli') || item.name.toLowerCase().includes('green bean')))
  const starches = menuItems.filter(item => item.category === 'starch' || (item.category === 'side' && (item.name.toLowerCase().includes('rice') || item.name.toLowerCase().includes('potato') || item.name.toLowerCase().includes('fries'))))
  const condiments = menuItems.filter(item => item.category === 'condiment')
  const seasonings = menuItems.filter(item => item.category === 'seasoning')
  const beverages = menuItems.filter(item => item.category === 'beverage')
  const desserts = menuItems.filter(item => item.category === 'dessert')
  
  const renderStepContent = () => {
    // Show loading only on initial page load, not when switching meals
    if (isInitialLoading && currentStep === 'meal') {
      return (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Loading menu options...</p>
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
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Choose Your Entree
              </h2>
              <p className="mt-1 text-muted-foreground">
                Select an entree, and optionally add soup or salad
              </p>
            </div>
            
            {entrees.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Entrees</h3>
                <ItemSelectionGrid
                  items={entrees}
                  category="entree"
                  selectedItems={selection.entree ? [selection.entree] : []}
                  onSelect={handleEntreeSelect}
                  maxSelections={1}
                  patientAllergies={patient.allergies}
                  patientDietType={patient.diet_type}
                />
              </div>
            )}
            
            {soups.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Soup (Optional)</h3>
                <ItemSelectionGrid
                  items={soups}
                  category="soup"
                  selectedItems={selection.soup ? [selection.soup] : []}
                  onSelect={handleSoupSelect}
                  maxSelections={1}
                  patientAllergies={patient.allergies}
                  patientDietType={patient.diet_type}
                />
              </div>
            )}
            
            {salads.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Salad (Optional)</h3>
                <ItemSelectionGrid
                  items={salads}
                  category="salad"
                  selectedItems={selection.salad ? [selection.salad] : []}
                  onSelect={handleSaladSelect}
                  maxSelections={1}
                  patientAllergies={patient.allergies}
                  patientDietType={patient.diet_type}
                />
              </div>
            )}
          </div>
        )
      
      case 'sides':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Choose Your Sides
              </h2>
              <p className="mt-1 text-muted-foreground">
                Select a vegetable and a starch
              </p>
            </div>
            
            {vegetables.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Vegetable</h3>
                <ItemSelectionGrid
                  items={vegetables}
                  category="vegetable"
                  selectedItems={selection.vegetable ? [selection.vegetable] : []}
                  onSelect={handleVegetableSelect}
                  maxSelections={1}
                  patientAllergies={patient.allergies}
                  patientDietType={patient.diet_type}
                />
              </div>
            )}
            
            {starches.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Starch</h3>
                <ItemSelectionGrid
                  items={starches}
                  category="starch"
                  selectedItems={selection.starch ? [selection.starch] : []}
                  onSelect={handleStarchSelect}
                  maxSelections={1}
                  patientAllergies={patient.allergies}
                  patientDietType={patient.diet_type}
                />
              </div>
            )}
          </div>
        )
      
      case 'condiments':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Add Condiments & Seasonings
              </h2>
              <p className="mt-1 text-muted-foreground">
                These are optional - select any you would like
              </p>
            </div>
            
            {seasonings.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Seasonings</h3>
                <ItemSelectionGrid
                  items={seasonings}
                  category="seasoning"
                  selectedItems={selection.seasonings}
                  onSelect={handleSeasoningSelect}
                  maxSelections={10}
                  patientAllergies={patient.allergies}
                  patientDietType={patient.diet_type}
                />
              </div>
            )}
            
            {condiments.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Condiments & Dressings</h3>
                <ItemSelectionGrid
                  items={condiments}
                  category="condiment"
                  selectedItems={selection.condiments}
                  onSelect={handleCondimentSelect}
                  maxSelections={10}
                  patientAllergies={patient.allergies}
                  patientDietType={patient.diet_type}
                />
              </div>
            )}
            
            {condiments.length === 0 && seasonings.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <p>No condiments or seasonings available for your diet.</p>
              </div>
            )}
          </div>
        )
      
      case 'beverage':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Choose Your Beverage
              </h2>
            </div>
            <ItemSelectionGrid
              items={beverages}
              category="beverage"
              selectedItems={selection.beverage ? [selection.beverage] : []}
              onSelect={handleBeverageSelect}
              maxSelections={1}
              patientAllergies={patient.allergies}
              patientDietType={patient.diet_type}
            />
          </div>
        )
      
      case 'dessert':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Choose Your Dessert
              </h2>
              <p className="mt-1 text-muted-foreground">
                Dessert is optional
              </p>
            </div>
            <ItemSelectionGrid
              items={desserts}
              category="dessert"
              selectedItems={selection.dessert ? [selection.dessert] : []}
              onSelect={handleDessertSelect}
              maxSelections={1}
              patientAllergies={patient.allergies}
              patientDietType={patient.diet_type}
            />
          </div>
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
              {currentStep === 'condiments' || currentStep === 'dessert' || currentStep === 'sides' ? 'Continue' : 'Continue'}
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}
