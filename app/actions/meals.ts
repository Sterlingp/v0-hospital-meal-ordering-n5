'use server'

import { createClient } from '@/lib/supabase/server'
import type { Patient, MenuItem, MealType, Order, MealSelection } from '@/lib/types'

export async function getPatient(patientId: string): Promise<Patient | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .single()
  
  if (error) {
    console.error('Error fetching patient:', error)
    return null
  }
  
  return data
}

export async function getMenuItemsForMeal(
  mealType: MealType,
  dietType: string
): Promise<MenuItem[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .contains('meal_types', [mealType])
    .eq('is_available', true)
    .contains('allowed_diets', [dietType])
    .order('category')
    .order('name')
  
  if (error) {
    console.error('Error fetching menu items:', error)
    return []
  }
  
  return data || []
}

export async function submitOrder(
  patientId: string,
  mealType: MealType,
  selection: MealSelection,
  specialRequests: string | null
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const supabase = await createClient()
  
  // Calculate scheduled delivery time based on meal type
  const now = new Date()
  const scheduledFor = new Date()
  
  if (mealType === 'breakfast') {
    scheduledFor.setHours(7, 30, 0, 0)
    if (now.getHours() >= 7) {
      scheduledFor.setDate(scheduledFor.getDate() + 1)
    }
  } else if (mealType === 'lunch') {
    scheduledFor.setHours(12, 0, 0, 0)
    if (now.getHours() >= 12) {
      scheduledFor.setDate(scheduledFor.getDate() + 1)
    }
  } else {
    scheduledFor.setHours(17, 30, 0, 0)
    if (now.getHours() >= 17) {
      scheduledFor.setDate(scheduledFor.getDate() + 1)
    }
  }
  
  // Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      patient_id: patientId,
      meal_type: mealType,
      status: 'pending',
      special_requests: specialRequests,
      scheduled_for: scheduledFor.toISOString(),
    })
    .select()
    .single()
  
  if (orderError) {
    console.error('Error creating order:', orderError)
    return { success: false, error: 'Failed to create order' }
  }
  
  // Collect all items to add
  const orderItems: { order_id: string; menu_item_id: string; quantity: number }[] = []
  
  if (selection.entree) {
    orderItems.push({ order_id: order.id, menu_item_id: selection.entree.id, quantity: 1 })
  }
  
  if (selection.soup) {
    orderItems.push({ order_id: order.id, menu_item_id: selection.soup.id, quantity: 1 })
  }
  
  if (selection.salad) {
    orderItems.push({ order_id: order.id, menu_item_id: selection.salad.id, quantity: 1 })
  }
  
  if (selection.vegetable) {
    orderItems.push({ order_id: order.id, menu_item_id: selection.vegetable.id, quantity: 1 })
  }
  
  if (selection.starch) {
    orderItems.push({ order_id: order.id, menu_item_id: selection.starch.id, quantity: 1 })
  }
  
  for (const condiment of selection.condiments) {
    orderItems.push({ order_id: order.id, menu_item_id: condiment.id, quantity: 1 })
  }
  
  for (const seasoning of selection.seasonings) {
    orderItems.push({ order_id: order.id, menu_item_id: seasoning.id, quantity: 1 })
  }
  
  if (selection.beverage) {
    orderItems.push({ order_id: order.id, menu_item_id: selection.beverage.id, quantity: 1 })
  }
  
  for (const addon of selection.beverageAddons) {
    orderItems.push({ order_id: order.id, menu_item_id: addon.id, quantity: 1 })
  }
  
  if (selection.dessert) {
    orderItems.push({ order_id: order.id, menu_item_id: selection.dessert.id, quantity: 1 })
  }
  
  // Insert all order items
  if (orderItems.length > 0) {
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
    
    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Rollback: delete the order
      await supabase.from('orders').delete().eq('id', order.id)
      return { success: false, error: 'Failed to add items to order' }
    }
  }
  
  return { success: true, orderId: order.id }
}

export async function getPatientOrders(patientId: string): Promise<Order[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        menu_item:menu_items (*)
      )
    `)
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }
  
  return data || []
}
