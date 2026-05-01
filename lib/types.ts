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
  // Dietary restriction flags
  is_vegetarian: boolean
  is_sugar_free: boolean
  is_low_sodium: boolean
  created_at: string
  updated_at: string
}

// Filter menu items based on patient diet and allergies
export function filterMenuItemsForPatient(items: MenuItem[], patient: Patient): MenuItem[] {
  return items.filter(item => {
    // --- ALLERGEN CHECK ---
    // Hard exclude: item contains an allergen the patient has
    const hasAllergenConflict = patient.allergies.some(allergy =>
      item.allergens.some(itemAllergen =>
        itemAllergen.toLowerCase().includes(allergy.toLowerCase()) ||
        allergy.toLowerCase().includes(itemAllergen.toLowerCase())
      )
    )
    if (hasAllergenConflict) return false

    // --- DIET-SPECIFIC RESTRICTIONS ---
    switch (patient.diet_type) {

      case 'vegetarian':
        // Only vegetarian items. Seasonings/condiments/beverages/sides/desserts are all fine.
        if (item.category === 'entree' || item.category === 'soup') {
          if (!item.is_vegetarian) return false
        }
        break

      case 'carb_controlled':
        // Filter desserts that have no sugar-free alternative
        // Pancakes are OK (modal forces sugar-free syrup). Juices are OK.
        if (item.category === 'dessert' && !item.name.toLowerCase().includes('sugar-free')) return false
        // Remove regular sugar from beverage add-ons
        if (item.name === 'Sugar') return false
        break

      case 'no_added_salt':
        // Filter high-sodium items; always allow seasonings so patient can self-manage
        if (!item.is_low_sodium && item.category !== 'seasoning') return false
        // Explicitly exclude Salt seasoning
        if (item.name === 'Salt') return false
        break

      case 'renal':
        // Cottage Cheese and Yogurt are explicitly allowed (lower potassium dairy)
        if (item.name === 'Cottage Cheese' || item.name === 'Yogurt') return true
        // Exclude items with renal-restricted ingredients
        if (hasRenalRestriction(item.name, item.description)) return false
        // Exclude high-sodium items (seasonings shown for self-management)
        if (!item.is_low_sodium && item.category !== 'seasoning') return false
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
  patient.allergies.forEach(allergy => {
    if (item.allergens.some(a => a.toLowerCase().includes(allergy.toLowerCase()))) {
      warnings.push(`Contains ${allergy}`)
    }
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
  choices: { value: string; label: string; dietRestrictions?: DietType[] }[]
  required?: boolean
  multiple?: boolean
}

export interface EntreeOptionsConfig {
  [entreeName: string]: EntreeOption[]
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
    {
      id: 'dressing',
      label: 'Choose Dressing',
      choices: [
        { value: 'none', label: 'No Dressing' },
        { value: 'ranch', label: 'Ranch Dressing' },
        { value: 'italian', label: 'Italian Dressing' },
        { value: 'raspberry', label: 'Raspberry Vinaigrette' },
      ],
    },
    {
      id: 'soup',
      label: 'Add Soup (Optional)',
      choices: [
        { value: 'none', label: 'No Soup' },
        { value: 'chicken_noodle', label: 'Chicken Noodle Soup', dietRestrictions: ['vegetarian'] },
        { value: 'tomato', label: 'Tomato Soup' },
        { value: 'vegetable_broth', label: 'Vegetable Broth' },
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
        { value: 'cheese', label: 'Cheese', dietRestrictions: ['renal', 'heart_healthy'] },
        { value: 'picante', label: 'Picante Sauce', dietRestrictions: ['no_added_salt'] },
      ],
      multiple: true,
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
        { value: 'margarine', label: 'Margarine' },
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
        { value: 'margarine', label: 'Margarine' },
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
        { value: 'margarine', label: 'Margarine' },
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
        { value: 'american', label: 'American Cheese' },
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
