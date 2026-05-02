export type DietType = 'regular' | 'heart_healthy' | 'renal' | 'carb_controlled' | 'vegetarian' | 'no_added_salt'

export type MealType = 'breakfast' | 'lunch' | 'dinner'

export type ItemCategory = 'entree' | 'side' | 'beverage' | 'dessert' | 'condiment' | 'seasoning' | 'soup' | 'salad' | 'vegetable' | 'starch' | 'beverage_addon' | 'dressing' | 'salad_addon'

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export interface Patient {
  id: string
  first_name: string
  last_name: string
  room_number: string
  diet_type: DietType
  allergies: string[]
  special_instructions: string | null
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  name: string
  description: string | null
  meal_types: MealType[]
  category: ItemCategory
  image_url: string | null
  calories: number | null
  protein_g: number | null
  carbs_g: number | null
  fat_g: number | null
  sodium_mg: number | null
  is_available: boolean
  allowed_diets: DietType[]
  allergens: string[]
  // Legacy optional flags used by some test fixtures; live diet enforcement
  // should rely on allowed_diets and explicit runtime restrictions.
  is_vegetarian?: boolean
  is_sugar_free?: boolean
  is_low_sodium?: boolean
  created_at: string
  updated_at: string
}

function getConflictingAllergens(itemAllergens: string[], patientAllergies: string[]): string[] {
  return itemAllergens.filter((itemAllergen) =>
    patientAllergies.some((allergy) => {
      const normalizedAllergy = normalizeText(allergy)
      const normalizedItemAllergen = normalizeText(itemAllergen)
      return (
        normalizedItemAllergen.includes(normalizedAllergy) ||
        normalizedAllergy.includes(normalizedItemAllergen)
      )
    })
  )
}

// Filter menu items based on patient diet and allergies
export function filterMenuItemsForPatient(items: MenuItem[], patient: Patient): MenuItem[] {
  return items.filter(item => {
    // --- ALLERGEN CHECK ---
    if (getBlockingAllergenConflicts(item, patient.allergies).length > 0) return false

    // --- ALLOWED DIETS CHECK ---
    // The authoritative menu metadata lives in SQL. Enforce it first, then
    // apply any extra runtime restrictions below.
    if (item.allowed_diets.length > 0 && !item.allowed_diets.includes(patient.diet_type)) {
      return false
    }

    // --- DIET-SPECIFIC RESTRICTIONS ---
    switch (patient.diet_type) {

      case 'vegetarian':
        // allowed_diets is the source of truth for vegetarian eligibility
        break

      case 'carb_controlled':
        // Filter desserts that have no sugar-free alternative
        if (item.category === 'dessert' && !item.name.toLowerCase().includes('sugar-free')) return false
        // Remove regular sugar from beverage add-ons
        if (item.name === 'Sugar') return false
        break

      case 'no_added_salt':
        // allowed_diets is the source of truth for NAS eligibility
        // Explicitly exclude Salt seasoning
        if (item.name === 'Salt') return false
        break

      case 'renal':
        // Cottage Cheese and Yogurt are explicitly allowed (lower potassium dairy)
        if (item.name === 'Cottage Cheese' || item.name === 'Yogurt') return true
        // Exclude items with renal-restricted ingredients
        if (hasRenalRestriction(item.name, item.description)) return false
        // allowed_diets is the source of truth for renal eligibility
        // Exclude Salt seasoning explicitly
        if (item.name === 'Salt') return false
        // Exclude dairy allergen items (patient has shellfish+dairy allergies)
        // (already caught by allergen check above)
        break

      case 'heart_healthy':
        // Exclude fried/high-fat and specific high-sodium items
        // Remove: Chicken Tenders, Grilled Cheese Sandwich, Macaroni & Cheese, Vegetable Broth, Salt
        const heartHealthyExclude = [
          'Chicken Tenders',
          'Grilled Cheese Sandwich',
          'Macaroni & Cheese',
          'Vegetable Broth',
          'Salt',
        ]
        if (heartHealthyExclude.includes(item.name)) return false
        // All condiments allowed for heart healthy
        if (item.category === 'condiment' || item.category === 'seasoning') return true
        break

      case 'regular':
      default:
        break
    }

    return true
  })
}

// Check if an item has a warning (but not filtered out) for a patient
export function getItemWarnings(item: MenuItem, patient: Patient): string[] {
  const warnings: string[] = []
  
  // Check for allergen presence (even partial matches worth warning)
  const blockingAllergens = getBlockingAllergenConflicts(item, patient.allergies)
  blockingAllergens.forEach((allergen) => {
    warnings.push(`Contains ${allergen}`)
  })
  
  // Renal warnings
  if (patient.diet_type === 'renal' && hasRenalRestriction(item.name, item.description)) {
    warnings.push('Not recommended for renal diet')
  }
  
  return warnings
}

export interface Order {
  id: string
  patient_id: string
  meal_type: MealType
  status: OrderStatus
  special_requests: string | null
  order_date: string
  created_at: string
  updated_at: string
  patient?: Patient
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  notes: string | null
  created_at: string
  menu_item?: MenuItem
}

// Entree options configuration - which entrees have which options
export interface EntreeOption {
  id: string
  label: string
  choices: {
    value: string
    label: string
    dietRestrictions?: DietType[]
    allergenRestrictions?: string[]
  }[]
  required?: boolean
  multiple?: boolean
}

export interface EntreeOptionsConfig {
  [entreeName: string]: EntreeOption[]
}

const OPTIONAL_ALLERGEN_OVERRIDES: Record<string, string[]> = {
  'Classic Burger': ['milk'],
  'Breakfast Sandwich': ['milk'],
  'Ham & Cheese Omelet': ['milk'],
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase()
}

function allergensConflict(patientAllergies: string[], allergens: string[]): boolean {
  return patientAllergies.some((allergy) => {
    const normalizedAllergy = normalizeText(allergy)
    return allergens.some((allergen) => {
      const normalizedAllergen = normalizeText(allergen)
      return normalizedAllergen.includes(normalizedAllergy) || normalizedAllergy.includes(normalizedAllergen)
    })
  })
}

function getRemovableAllergenConflicts(item: MenuItem, patientAllergies: string[]): string[] {
  const removableAllergens = OPTIONAL_ALLERGEN_OVERRIDES[item.name] || []
  return getConflictingAllergens(item.allergens, patientAllergies).filter((allergen) =>
    patientAllergies.some((allergy) => {
      const normalizedAllergy = normalizeText(allergy)
      const normalizedAllergen = normalizeText(allergen)
      const conflict =
        normalizedAllergen.includes(normalizedAllergy) ||
        normalizedAllergy.includes(normalizedAllergen)

      if (!conflict) return false

      return removableAllergens.some((removable) => {
        const normalizedRemovable = normalizeText(removable)
        return normalizedAllergen.includes(normalizedRemovable) || normalizedRemovable.includes(normalizedAllergen)
      })
    })
  )
}

export function getBlockingAllergenConflicts(item: MenuItem, patientAllergies: string[]): string[] {
  const removableConflicts = getRemovableAllergenConflicts(item, patientAllergies)
  const conflictingAllergens = getConflictingAllergens(item.allergens, patientAllergies)
  return conflictingAllergens.filter((allergen) => !removableConflicts.includes(allergen))
}

export function getAvailableChoicesForOption(
  option: EntreeOption,
  patientDietType: DietType,
  patientAllergies: string[] = []
) {
  return option.choices.filter((choice) => {
    if (choice.dietRestrictions?.includes(patientDietType)) return false
    if (choice.allergenRestrictions && allergensConflict(patientAllergies, choice.allergenRestrictions)) return false
    return true
  })
}

export function getResolvedSingleChoiceOptions(
  itemName: string,
  patientDietType: DietType,
  patientAllergies: string[] = []
): SelectedEntreeOptions | null {
  const optionsConfig = ENTREE_OPTIONS[itemName]
  if (!optionsConfig) return null

  const resolved: SelectedEntreeOptions = {}

  for (const option of optionsConfig) {
    const availableChoices = getAvailableChoicesForOption(option, patientDietType, patientAllergies)

    if (option.multiple) {
      if (availableChoices.length > 0) return null
      resolved[option.id] = []
      continue
    }

    if (availableChoices.length === 0) {
      if (option.required) return null
      resolved[option.id] = ''
      continue
    }

    if (availableChoices.length > 1) return null
    resolved[option.id] = availableChoices[0].value
  }

  return resolved
}

export const ENTREE_OPTIONS: EntreeOptionsConfig = {
  'Garden Salad': [
    {
      id: 'protein',
      label: 'Choose Protein (Optional)',
      choices: [
        { value: 'none', label: 'No Protein (Regular)' },
        { value: 'chicken', label: 'Grilled Chicken', dietRestrictions: ['vegetarian'] },
        { value: 'salmon', label: 'Salmon', dietRestrictions: ['vegetarian'] },
      ],
    },
  ],
  'Breakfast Taco': [
    {
      id: 'protein',
      label: 'Choose Protein',
      choices: [
        { value: 'pork_sausage', label: 'Pork Sausage', dietRestrictions: ['renal', 'heart_healthy'] },
        { value: 'turkey_sausage', label: 'Turkey Sausage' },
        { value: 'ham', label: 'Ham', dietRestrictions: ['renal', 'heart_healthy'] },
        { value: 'bacon', label: 'Bacon', dietRestrictions: ['renal'] },
        { value: 'turkey_bacon', label: 'Turkey Bacon' },
      ],
      required: true,
    },
    {
      id: 'extras',
      label: 'Add Extras',
      choices: [
        {
          value: 'cheese',
          label: 'Cheese',
          dietRestrictions: ['renal', 'heart_healthy'],
          allergenRestrictions: ['milk'],
        },
        { value: 'picante', label: 'Picante Sauce', dietRestrictions: ['no_added_salt'] },
      ],
      multiple: true,
    },
  ],
  'Breakfast Sandwich': [
    {
      id: 'cheese',
      label: 'Add Cheese?',
      choices: [
        { value: 'no_cheese', label: 'No Cheese' },
        { value: 'american', label: 'American Cheese', allergenRestrictions: ['milk'] },
      ],
    },
  ],
  'Ham & Cheese Omelet': [
    {
      id: 'cheese',
      label: 'Add Cheese?',
      choices: [
        { value: 'no_cheese', label: 'No Cheese' },
        { value: 'cheese', label: 'Cheese', allergenRestrictions: ['milk'] },
      ],
    },
  ],
  'Eggs': [
    {
      id: 'type',
      label: 'Egg Type',
      choices: [
        { value: 'regular', label: 'Regular' },
        { value: 'lo_chol', label: 'Lo-Chol', dietRestrictions: [] },
      ],
      required: true,
    },
    {
      id: 'preparation',
      label: 'Preparation',
      choices: [
        { value: 'scrambled', label: 'Scrambled' },
        { value: 'fried', label: 'Fried' },
        { value: 'hard_boiled', label: 'Hard Boiled' },
      ],
      required: true,
    },
  ],
  'Pancakes': [
    {
      id: 'syrup',
      label: 'Choose Syrup',
      choices: [
        { value: 'regular', label: 'Regular Syrup', dietRestrictions: ['carb_controlled'] },
        { value: 'sugar_free', label: 'Sugar-Free Syrup' },
      ],
      required: true,
    },
  ],
  'Wheat Toast': [
    {
      id: 'spread',
      label: 'Choose Spread',
      choices: [
        { value: 'none', label: 'No Spread' },
        { value: 'jelly', label: 'Jelly', dietRestrictions: ['carb_controlled'] },
        { value: 'sf_jelly', label: 'Sugar-Free Jelly' },
      ],
      multiple: true,
    },
  ],
  'Blueberry Muffin': [
    {
      id: 'spread',
      label: 'Choose Spread',
      choices: [
        { value: 'none', label: 'No Spread' },
        { value: 'jelly', label: 'Jelly', dietRestrictions: ['carb_controlled'] },
        { value: 'sf_jelly', label: 'Sugar-Free Jelly' },
      ],
      multiple: true,
    },
  ],
  'Flour Tortilla': [
    {
      id: 'spread',
      label: 'Choose Spread',
      choices: [
        { value: 'none', label: 'No Spread' },
        { value: 'jelly', label: 'Jelly', dietRestrictions: ['carb_controlled'] },
        { value: 'sf_jelly', label: 'Sugar-Free Jelly' },
      ],
      multiple: true,
    },
  ],
  'Quesadilla': [
    {
      id: 'filling',
      label: 'Choose Filling',
      choices: [
        { value: 'chicken', label: 'Chicken' },
        { value: 'vegetable', label: 'Vegetable' },
      ],
      required: true,
    },
  ],
  'Classic Burger': [
    {
      id: 'cheese',
      label: 'Add Cheese?',
      choices: [
        { value: 'no_cheese', label: 'No Cheese' },
        { value: 'american', label: 'American Cheese', allergenRestrictions: ['milk'] },
      ],
    },
  ],
  'Deli Sandwich': [
    {
      id: 'meat',
      label: 'Choose Meat',
      choices: [
        { value: 'turkey', label: 'Turkey' },
        { value: 'tuna_salad', label: 'Tuna Salad' },
        { value: 'ham', label: 'Ham' },
      ],
      required: true,
    },
  ],
}

export interface SelectedEntreeOptions {
  [optionId: string]: string | string[]
}

export interface MealSelection {
  entree: MenuItem | null
  entreeOptions: SelectedEntreeOptions
  soup: MenuItem | null
  salad: MenuItem | null
  saladDressing: MenuItem | null
  saladAddons: MenuItem[]  // crackers, chicken, salmon
  vegetable: MenuItem | null
  starch: MenuItem | null
  condiments: MenuItem[]
  beverage: MenuItem | null
  beverageAddons: MenuItem[]
  dessert: MenuItem | null
}

export const DIET_LABELS: Record<DietType, string> = {
  regular: 'Regular',
  heart_healthy: 'Heart Healthy',
  renal: 'Renal',
  carb_controlled: 'Carb Controlled',
  vegetarian: 'Vegetarian',
  no_added_salt: 'No Added Salt',
}

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
}

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  entree: 'Entree',
  side: 'Side',
  beverage: 'Beverage',
  dessert: 'Dessert',
  condiment: 'Condiment',
  seasoning: 'Seasoning',
  soup: 'Soup',
  salad: 'Salad',
  vegetable: 'Vegetable',
  starch: 'Starch',
  beverage_addon: 'Add-on',
  dressing: 'Dressing',
  salad_addon: 'Salad Add-on',
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

// Renal diet restrictions - foods high in potassium, phosphorus, or sodium
// Based on "NO banana, orange, potato, tomato, salt" from renal tray ticket
export const RENAL_RESTRICTED_FOODS = [
  'banana',
  'orange',
  'potato',
  'potatoes',
  'tomato',
  'tomatoes',
  'salt',
  'orange juice',
  'tomato soup',
  'mashed potatoes',
  'oven baked fries',
  'french fries',
  'picante sauce',
  'salsa',
] as const

export function hasRenalRestriction(itemName: string, description?: string | null): boolean {
  const textToCheck = `${itemName} ${description || ''}`.toLowerCase()
  return RENAL_RESTRICTED_FOODS.some(food => textToCheck.includes(food.toLowerCase()))
}

export const ORDER_STEPS = ['meal', 'entree', 'sides', 'condiments', 'beverage', 'dessert', 'review'] as const
export type OrderStep = (typeof ORDER_STEPS)[number]

export const STEP_LABELS: Record<OrderStep, string> = {
  meal: 'Select Meal',
  entree: 'Choose Entree',
  sides: 'Choose Sides',
  condiments: 'Add Condiments',
  beverage: 'Choose Beverage',
  dessert: 'Choose Dessert',
  review: 'Review Order',
}
