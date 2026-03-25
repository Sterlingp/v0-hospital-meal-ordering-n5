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
  created_at: string
  updated_at: string
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

export interface MealSelection {
  entree: MenuItem | null
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
