'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Patient, MenuItem, MealType, MealSelection, OrderStep, SelectedEntreeOptions } from '@/lib/types'
import { ORDER_STEPS, STEP_LABELS, ENTREE_OPTIONS, filterMenuItemsForPatient } from '@/lib/types'
import { ProgressBar } from './progress-bar'
import { MealTypeSelector } from './meal-type-selector'
import { ItemSelectionGrid } from './item-selection-grid'
import { OrderReview } from './order-review'
import { EntreeOptionsModal } from './entree-options-modal'
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
    entreeOptions: {},
    soup: null,
    salad: null,
    saladDressing: null,
    saladAddons: [],
    vegetable: null,
    starch: null,
    condiments: [],
    beverage: null,
    beverageAddons: [],
    dessert: null,
  })
  const [showSoupSaladPrompt, setShowSoupSaladPrompt] = useState(false)
  const [showSaladAddons, setShowSaladAddons] = useState(false)
  const [pendingEntree, setPendingEntree] = useState<MenuItem | null>(null)
  const [showEntreeOptions, setShowEntreeOptions] = useState(false)
  const [pendingSide, setPendingSide] = useState<MenuItem | null>(null)
  const [showSideOptions, setShowSideOptions] = useState(false)
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
  
  // Get menu items for current meal type from cache, filtered for patient's diet and allergies
  const rawMenuItems = mealType ? menuCache[mealType] : []
  const menuItems = filterMenuItemsForPatient(rawMenuItems, patient)
  
  const currentStepIndex = ORDER_STEPS.indexOf(currentStep)
  
  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case 'meal':
        return mealType !== null // User clicks a meal card which auto-advances
      case 'entree': {
        // Allow proceeding if no entrees are available due to restrictions, or if something is selected
        const availableEntrees = menuItems.filter(i => i.category === 'entree')
        return availableEntrees.length === 0 || selection.entree !== null || selection.soup !== null || selection.salad !== null
      }
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
  }, [currentStep, mealType, selection, menuItems])
  
  const goToNextStep = () => {
    if (currentStepIndex < ORDER_STEPS.length - 1) {
      let nextStep = ORDER_STEPS[currentStepIndex + 1]
      // Skip dessert step for breakfast
      if (nextStep === 'dessert' && mealType === 'breakfast') {
        nextStep = 'review'
      }
      setCurrentStep(nextStep)
    }
  }
  
  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      let prevStep = ORDER_STEPS[currentStepIndex - 1]
      // Skip dessert step for breakfast when going back
      if (prevStep === 'dessert' && mealType === 'breakfast') {
        prevStep = 'beverage'
      }
      setCurrentStep(prevStep)
    }
  }
  
  const handleMealSelect = (meal: MealType) => {
    setMealType(meal)
    // Reset selections when changing meal type
    setSelection({
      entree: null,
      entreeOptions: {},
      soup: null,
      salad: null,
      saladDressing: null,
      saladAddons: [],
      vegetable: null,
      starch: null,
      condiments: [],
      beverage: null,
      beverageAddons: [],
      dessert: null,
    })
    setShowSoupSaladPrompt(false)
    setShowSaladAddons(false)
    setPendingEntree(null)
    setShowEntreeOptions(false)
    // Auto-advance to entree selection
    setCurrentStep('entree')
  }
  
  const handleEntreeSelect = (item: MenuItem) => {
    const isDeselecting = selection.entree?.id === item.id
    
    if (isDeselecting) {
      // Deselecting - clear the entree
      setSelection((prev) => ({
        ...prev,
        entree: null,
        entreeOptions: {},
      }))
      setShowSoupSaladPrompt(false)
      return
    }
    
    // Check if this entree has options
    const hasOptions = ENTREE_OPTIONS[item.name]
    if (hasOptions) {
      // Show options modal
      setPendingEntree(item)
      setShowEntreeOptions(true)
    } else {
      // No options, select directly
      setSelection((prev) => ({
        ...prev,
        entree: item,
        entreeOptions: {},
        // Clear soup/salad if selecting a non-salad entree after having a salad
        soup: prev.soup,
        salad: null,
        saladDressing: null,
        saladAddons: [],
      }))
      // Show soup/salad prompt when an entree is selected (for lunch/dinner)
      // But don't show salad option if the entree IS a salad
      if (mealType !== 'breakfast' && item.category !== 'salad') {
        setShowSoupSaladPrompt(true)
      } else {
        setShowSoupSaladPrompt(false)
      }
    }
  }
  
  const handleEntreeOptionsConfirm = (item: MenuItem, options: SelectedEntreeOptions) => {
    // Check if this is a salad being selected as entree
    const isSaladEntree = item.name.toLowerCase().includes('salad')
    
    setSelection((prev) => ({
      ...prev,
      entree: item,
      entreeOptions: options,
      // Clear side salad if selecting salad as entree
      salad: isSaladEntree ? null : prev.salad,
      saladDressing: isSaladEntree ? null : prev.saladDressing,
      saladAddons: isSaladEntree ? [] : prev.saladAddons,
    }))
    setPendingEntree(null)
    setShowEntreeOptions(false)
    // Show soup/salad prompt when an entree is selected (for lunch/dinner)
    // But don't show if the entree is already a salad
    if (mealType !== 'breakfast' && !isSaladEntree) {
      setShowSoupSaladPrompt(true)
    } else {
      setShowSoupSaladPrompt(false)
    }
  }
  
  const handleEntreeOptionsClose = () => {
    setPendingEntree(null)
    setShowEntreeOptions(false)
  }
  
  const handleSoupSelect = (item: MenuItem) => {
    // Allow direct switching - clicking same item deselects, clicking different item selects it
    setSelection((prev) => ({
      ...prev,
      soup: prev.soup?.id === item.id ? null : item,
    }))
  }
  
  const handleSaladSelect = (item: MenuItem) => {
    const isDeselecting = selection.salad?.id === item.id
    setSelection((prev) => ({
      ...prev,
      salad: isDeselecting ? null : item,
      // Clear salad add-ons when deselecting salad
      saladDressing: isDeselecting ? null : prev.saladDressing,
      saladAddons: isDeselecting ? [] : prev.saladAddons,
    }))
    setShowSaladAddons(!isDeselecting)
  }
  
  const handleSaladDressingSelect = (item: MenuItem) => {
    setSelection((prev) => ({
      ...prev,
      saladDressing: prev.saladDressing?.id === item.id ? null : item,
    }))
  }
  
  const handleSaladAddonSelect = (item: MenuItem) => {
    setSelection((prev) => {
      const isSelected = prev.saladAddons.some((a) => a.id === item.id)
      if (isSelected) {
        return { ...prev, saladAddons: prev.saladAddons.filter((a) => a.id !== item.id) }
      }
      return { ...prev, saladAddons: [...prev.saladAddons, item] }
    })
  }
  
  const handleVegetableSelect = (item: MenuItem) => {
    // Direct switch - clicking same deselects, different selects new
    setSelection((prev) => ({
      ...prev,
      vegetable: prev.vegetable?.id === item.id ? null : item,
    }))
  }
  
  const handleStarchSelect = (item: MenuItem) => {
    const isDeselecting = selection.starch?.id === item.id
    
    if (isDeselecting) {
      setSelection((prev) => ({
        ...prev,
        starch: null,
      }))
      return
    }
    
    // Check if this side has options (like bread with spreads)
    const hasOptions = ENTREE_OPTIONS[item.name]
    if (hasOptions) {
      setPendingSide(item)
      setShowSideOptions(true)
    } else {
      setSelection((prev) => ({
        ...prev,
        starch: item,
      }))
    }
  }
  
  const handleSideOptionsConfirm = (item: MenuItem, options: SelectedEntreeOptions) => {
    setSelection((prev) => ({
      ...prev,
      starch: item,
      // Store side options in entreeOptions since it's the same structure
      entreeOptions: { ...prev.entreeOptions, [`side_${item.name}`]: options },
    }))
    setPendingSide(null)
    setShowSideOptions(false)
  }
  
  const handleSideOptionsClose = () => {
    setPendingSide(null)
    setShowSideOptions(false)
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
  
  
  
  const handleBeverageSelect = (item: MenuItem) => {
    const isDeselecting = selection.beverage?.id === item.id
    // Direct switch allowed - clicking different beverage switches to it
    setSelection((prev) => ({
      ...prev,
      beverage: isDeselecting ? null : item,
      // Clear add-ons if deselecting or changing beverage
      beverageAddons: [],
    }))
  }
  
  const handleBeverageAddonSelect = (item: MenuItem) => {
    setSelection((prev) => {
      const isSelected = prev.beverageAddons.some((a) => a.id === item.id)
      if (isSelected) {
        return { ...prev, beverageAddons: prev.beverageAddons.filter((a) => a.id !== item.id) }
      }
      return { ...prev, beverageAddons: [...prev.beverageAddons, item] }
    })
  }
  
  const handleDessertSelect = (item: MenuItem) => {
    // Direct switch - clicking same deselects, different selects new
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
        // Trigger auto-print in a popup window if print URL returned
        if (result.printUrl) {
          const printWindow = window.open(result.printUrl, '_blank', 'width=400,height=600')
          // Auto-close after printing (handled by the print page script)
          if (printWindow) {
            printWindow.onafterprint = () => printWindow.close()
          }
        }
        
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
  // Garden Salad is stored as category 'entree' in DB
  const entrees = menuItems.filter(item => item.category === 'entree')
  const soups = menuItems.filter(item => item.category === 'soup')
  
  // Check if entree is selected and if it's a salad
  const hasEntree = selection.entree !== null
  const entreeIsSalad = selection.entree?.name.toLowerCase().includes('salad')
  
  // Side salads: show Garden Salad as an option when another entree is selected
  // Use rawMenuItems (unfiltered) because all diets can have salad - only dressing is restricted
  const sideSalads = entreeIsSalad 
    ? [] 
    : rawMenuItems.filter(item => item.name === 'Garden Salad')
  
  const dressings = menuItems.filter(item => item.category === 'dressing')
  
  // Salad addons: show for side salad OR entree salad (dressing + crackers)
  const saladAddons = menuItems.filter(item => item.category === 'salad_addon')
  
  // Filter sides - vegetables and starches
  const vegetables = menuItems.filter(item => item.category === 'vegetable')
  const starches = menuItems.filter(item => item.category === 'starch')
  // Also get general sides that fit into either category
  const sides = menuItems.filter(item => item.category === 'side')
  
  const condiments = menuItems.filter(item => item.category === 'condiment')
  const seasonings = menuItems.filter(item => item.category === 'seasoning')
  const beverages = menuItems.filter(item => item.category === 'beverage')
  const beverageAddons = menuItems.filter(item => item.category === 'beverage_addon')
  const desserts = menuItems.filter(item => item.category === 'dessert')
  
  // Check if selected beverage is coffee or tea (needs add-ons)
  const needsBeverageAddons = selection.beverage && 
    (selection.beverage.name.toLowerCase().includes('coffee') || 
     selection.beverage.name.toLowerCase().includes('tea'))
  
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
                Select an entree for your meal
              </p>
            </div>
            
            {entrees.length > 0 ? (
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
            ) : (
              <div className="rounded-lg border-2 border-dashed border-muted p-8 text-center">
                <p className="text-lg font-medium text-foreground">No entrees available for this meal</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your dietary restrictions or allergies prevent options for this meal time. Please try a different meal or speak with your nurse.
                </p>
              </div>
            )}
            
            {/* Soup/Salad prompt after selecting an entree (but not if entree is a salad) */}
            {showSoupSaladPrompt && !entreeIsSalad && (soups.length > 0 || sideSalads.length > 0) && (
              <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Would you like to add a soup{sideSalads.length > 0 ? ' or side salad' : ''}?
                </h3>
                
                {soups.length > 0 && (
                  <div className={sideSalads.length > 0 ? "mb-6" : ""}>
                    <h4 className="mb-3 text-base font-medium text-muted-foreground">Soup (Optional)</h4>
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
                
                {sideSalads.length > 0 && (
                  <div>
                    <h4 className="mb-3 text-base font-medium text-muted-foreground">Side Salad (Optional)</h4>
                    <ItemSelectionGrid
                      items={sideSalads}
                      category="salad"
                      selectedItems={selection.salad ? [selection.salad] : []}
                      onSelect={handleSaladSelect}
                      maxSelections={1}
                      patientAllergies={patient.allergies}
                      patientDietType={patient.diet_type}
                    />
                    
                    {/* Dressing for side salad */}
                    {showSaladAddons && selection.salad && dressings.length > 0 && (
                      <div className="mt-4 rounded-lg border bg-card p-4">
                        <h5 className="mb-2 text-sm font-medium text-foreground">Choose a Dressing</h5>
                        <ItemSelectionGrid
                          items={dressings}
                          category="dressing"
                          selectedItems={selection.saladDressing ? [selection.saladDressing] : []}
                          onSelect={handleSaladDressingSelect}
                          maxSelections={1}
                          patientAllergies={patient.allergies}
                          patientDietType={patient.diet_type}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      
      case 'sides':
        // For breakfast: bread items, fruit, and dairy
        // For lunch/dinner: vegetables and starches
        const breakfastBread = sides.filter(s => 
          s.name.toLowerCase().includes('toast') || 
          s.name.toLowerCase().includes('muffin') || 
          s.name.toLowerCase().includes('tortilla')
        )
        const breakfastFruitDairy = sides.filter(s => 
          s.name.toLowerCase().includes('berries') || 
          s.name.toLowerCase().includes('grapes') ||
          s.name.toLowerCase().includes('cottage') ||
          s.name.toLowerCase().includes('yogurt')
        )
        
        // Combine vegetables with veggie-type sides for lunch/dinner
        const allVegetables = [...vegetables, ...sides.filter(s => 
          s.name.toLowerCase().includes('carrot') || 
          s.name.toLowerCase().includes('broccoli') || 
          s.name.toLowerCase().includes('green bean') ||
          s.name.toLowerCase().includes('beans')
        )]
        const allStarches = [...starches, ...sides.filter(s => 
          s.name.toLowerCase().includes('rice') || 
          s.name.toLowerCase().includes('potato') || 
          s.name.toLowerCase().includes('fries')
        )]
        
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Choose Your Sides
              </h2>
              <p className="mt-1 text-muted-foreground">
                {mealType === 'breakfast' ? 'Select your sides' : 'Select a vegetable and a starch'}
              </p>
            </div>
            
            {/* BREAKFAST SIDES */}
            {mealType === 'breakfast' && (
              <>
                {breakfastBread.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Bread</h3>
                    <ItemSelectionGrid
                      items={breakfastBread}
                      category="side"
                      selectedItems={selection.starch ? [selection.starch] : []}
                      onSelect={handleStarchSelect}
                      maxSelections={1}
                      patientAllergies={patient.allergies}
                      patientDietType={patient.diet_type}
                    />
                  </div>
                )}
                
                {breakfastFruitDairy.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Fruit & Dairy</h3>
                    <ItemSelectionGrid
                      items={breakfastFruitDairy}
                      category="side"
                      selectedItems={selection.vegetable ? [selection.vegetable] : []}
                      onSelect={handleVegetableSelect}
                      maxSelections={1}
                      patientAllergies={patient.allergies}
                      patientDietType={patient.diet_type}
                    />
                  </div>
                )}
              </>
            )}
            
            {/* LUNCH/DINNER SIDES */}
            {mealType !== 'breakfast' && allVegetables.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Vegetable</h3>
                <ItemSelectionGrid
                  items={allVegetables}
                  category="vegetable"
                  selectedItems={selection.vegetable ? [selection.vegetable] : []}
                  onSelect={handleVegetableSelect}
                  maxSelections={1}
                  patientAllergies={patient.allergies}
                  patientDietType={patient.diet_type}
                />
              </div>
            )}
            
            {mealType !== 'breakfast' && allStarches.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Starch</h3>
                <ItemSelectionGrid
                  items={allStarches}
                  category="starch"
                  selectedItems={selection.starch ? [selection.starch] : []}
                  onSelect={handleStarchSelect}
                  maxSelections={1}
                  patientAllergies={patient.allergies}
                  patientDietType={patient.diet_type}
                />
              </div>
            )}
            
            {/* Empty state */}
            {((mealType === 'breakfast' && breakfastBread.length === 0 && breakfastFruitDairy.length === 0) ||
              (mealType !== 'breakfast' && allVegetables.length === 0 && allStarches.length === 0)) && (
              <div className="py-12 text-center text-muted-foreground">
                <p>No sides available for this meal.</p>
              </div>
            )}
          </div>
        )
      
      case 'condiments':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Add Condiments
              </h2>
              <p className="mt-1 text-muted-foreground">
                These are optional - select any you would like
              </p>
            </div>
            
            {condiments.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Sauces & Condiments</h3>
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
            
            {seasonings.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Seasonings</h3>
                <ItemSelectionGrid
                  items={seasonings}
                  category="seasoning"
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
                <p>No condiments available for your diet.</p>
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
            
            {/* Show add-ons for coffee/tea */}
            {needsBeverageAddons && beverageAddons.length > 0 && (
              <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Add-ons for your {selection.beverage?.name}
                </h3>
                <ItemSelectionGrid
                  items={beverageAddons}
                  category="beverage_addon"
                  selectedItems={selection.beverageAddons}
                  onSelect={handleBeverageAddonSelect}
                  maxSelections={10}
                  patientAllergies={patient.allergies}
                  patientDietType={patient.diet_type}
                />
              </div>
            )}
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
      
      {/* Entree Options Modal */}
      <EntreeOptionsModal
        item={pendingEntree}
        isOpen={showEntreeOptions}
        onClose={handleEntreeOptionsClose}
        onConfirm={handleEntreeOptionsConfirm}
        patientDietType={patient.diet_type}
      />
      
      {/* Side Options Modal (for bread items with spreads) */}
      <EntreeOptionsModal
        item={pendingSide}
        isOpen={showSideOptions}
        onClose={handleSideOptionsClose}
        onConfirm={handleSideOptionsConfirm}
        patientDietType={patient.diet_type}
      />
    </div>
  )
}
