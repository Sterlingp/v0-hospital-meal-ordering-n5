'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { OrderStatus } from '@/lib/types'

export interface KitchenOrder {
  id: string
  patient_id: string
  meal_type: 'breakfast' | 'lunch' | 'dinner'
  status: OrderStatus
  special_requests: string | null
  created_at: string
  submitted_at: string | null
  prepared_at: string | null
  delivered_at: string | null
  patient: {
    id: string
    first_name: string
    last_name: string
    room_number: string
    diet_type: string
    allergies: string[]
  }
  order_items: {
    id: string
    quantity: number
    notes: string | null
    menu_item: {
      id: string
      name: string
      category: string
    }
  }[]
}

export async function getKitchenOrders(status?: OrderStatus): Promise<KitchenOrder[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('orders')
    .select(`
      *,
      patient:patients (
        id,
        first_name,
        last_name,
        room_number,
        diet_type,
        allergies
      ),
      order_items (
        id,
        quantity,
        notes,
        menu_item:menu_items (
          id,
          name,
          category
        )
      )
    `)
    .order('created_at', { ascending: true })
  
  if (status) {
    query = query.eq('status', status)
  } else {
    // Get all active orders (not delivered or cancelled)
    query = query.in('status', ['pending', 'preparing', 'ready'])
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching kitchen orders:', error)
    return []
  }
  
  return data || []
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const updates: Record<string, unknown> = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  }
  
  // Set timestamps based on status
  if (newStatus === 'preparing') {
    updates.submitted_at = new Date().toISOString()
  } else if (newStatus === 'ready') {
    updates.prepared_at = new Date().toISOString()
  } else if (newStatus === 'delivered') {
    updates.delivered_at = new Date().toISOString()
  }
  
  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)
  
  if (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: 'Failed to update order status' }
  }
  
  revalidatePath('/kitchen')
  return { success: true }
}

export async function getOrderStats(): Promise<{
  pending: number
  preparing: number
  ready: number
  delivered_today: number
}> {
  const supabase = await createClient()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const { data: pending } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')
  
  const { data: preparing } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'preparing')
  
  const { data: ready } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'ready')
  
  const { data: delivered } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'delivered')
    .gte('delivered_at', today.toISOString())
  
  return {
    pending: pending?.length ?? 0,
    preparing: preparing?.length ?? 0,
    ready: ready?.length ?? 0,
    delivered_today: delivered?.length ?? 0,
  }
}
