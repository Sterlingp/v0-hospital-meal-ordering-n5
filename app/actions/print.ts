'use server'

import { createClient } from '@/lib/supabase/server'
import { generateTextReceipt, generateEscPosReceipt, type PrintableOrder } from '@/lib/printing'
import { revalidatePath } from 'next/cache'

export interface PrintSettings {
  enabled: boolean
  autoPrint: boolean
  printerType: 'browser' | 'escpos' | 'cloud'
  cloudPrintUrl?: string
  cloudApiKey?: string
  escposHost?: string
  escposPort?: number
}

// Default print settings (can be stored in DB later)
const defaultSettings: PrintSettings = {
  enabled: true,
  autoPrint: true,
  printerType: 'browser',
}

export async function getPrintSettings(): Promise<PrintSettings> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('print_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  if (data) {
    return {
      enabled: data.enabled,
      autoPrint: data.auto_print,
      printerType: data.printer_type as PrintSettings['printerType'],
      cloudPrintUrl: data.cloud_print_url ?? '',
      cloudApiKey: data.cloud_api_key ?? '',
      escposHost: data.escpos_host ?? '',
      escposPort: data.escpos_port ?? 9100,
    }
  }

  return {
    ...defaultSettings,
    enabled: process.env.PRINT_ENABLED !== 'false',
    autoPrint: process.env.AUTO_PRINT !== 'false',
    printerType: (process.env.PRINTER_TYPE as PrintSettings['printerType']) || 'browser',
    cloudPrintUrl: process.env.CLOUD_PRINT_URL,
    cloudApiKey: process.env.CLOUD_PRINT_API_KEY,
    escposHost: process.env.ESCPOS_HOST,
    escposPort: process.env.ESCPOS_PORT ? parseInt(process.env.ESCPOS_PORT) : 9100,
  }
}

export async function savePrintSettings(
  settings: PrintSettings
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('print_settings')
    .upsert({
      id: 1,
      enabled: settings.enabled,
      auto_print: settings.autoPrint,
      printer_type: settings.printerType,
      cloud_print_url: settings.cloudPrintUrl || null,
      cloud_api_key: settings.cloudApiKey || null,
      escpos_host: settings.escposHost || null,
      escpos_port: settings.escposPort ?? 9100,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error saving print settings:', error)
    return { success: false, error: 'Failed to save print settings' }
  }

  revalidatePath('/admin/print-settings')
  return { success: true }
}

export async function printOrder(
  orderId: string
): Promise<{ success: boolean; error?: string; printUrl?: string }> {
  const settings = await getPrintSettings()
  
  if (!settings.enabled) {
    return { success: true } // Silently skip if printing disabled
  }
  
  const supabase = await createClient()
  
  // Fetch order with items and patient
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      *,
      patient:patients (*),
      order_items (
        *,
        menu_item:menu_items (*)
      )
    `)
    .eq('id', orderId)
    .single()
  
  if (orderError || !order) {
    console.error('Error fetching order for print:', orderError)
    return { success: false, error: 'Order not found' }
  }
  
  // Transform to PrintableOrder format
  const printableOrder: PrintableOrder = {
    id: order.id,
    patient: order.patient,
    mealType: order.meal_type,
    orderDate: order.order_date,
    items: order.order_items.map((item: { id: string; menu_item: Record<string, unknown>; quantity: number; notes?: string }) => ({
      id: item.id,
      menu_item: item.menu_item,
      quantity: item.quantity || 1,
      notes: item.notes,
    })),
    specialRequests: order.special_requests,
    createdAt: order.created_at,
  }
  
  try {
    switch (settings.printerType) {
      case 'cloud':
        // Send to cloud print service
        if (settings.cloudPrintUrl) {
          const receipt = generateTextReceipt(printableOrder)
          const response = await fetch(settings.cloudPrintUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(settings.cloudApiKey ? { 'Authorization': `Bearer ${settings.cloudApiKey}` } : {}),
            },
            body: JSON.stringify({
              content: receipt,
              orderId: order.id,
              roomNumber: order.patient.room_number,
            }),
          })
          
          if (!response.ok) {
            throw new Error(`Cloud print failed: ${response.statusText}`)
          }
        }
        return { success: true }
        
      case 'escpos':
        // For ESC/POS, we generate the raw commands
        // The actual sending to printer is done client-side via WebSocket or browser extension
        const escposReceipt = generateEscPosReceipt(printableOrder)
        // Return the receipt data - client will handle actual printing
        return {
          success: true,
          printUrl: `/api/print?orderId=${orderId}&type=escpos`,
        }
        
      case 'browser':
      default:
        // Return URL for browser printing
        return {
          success: true,
          printUrl: `/api/print?orderId=${orderId}&autoprint=true&notifyParent=true`,
        }
    }
  } catch (error) {
    console.error('Print error:', error)
    return { success: false, error: 'Failed to print order' }
  }
}

// Trigger print for a newly submitted order
export async function autoPrintOrder(orderId: string): Promise<{ printUrl?: string }> {
  const settings = await getPrintSettings()
  
  if (!settings.enabled || !settings.autoPrint) {
    return {}
  }
  
  const result = await printOrder(orderId)
  
  if (result.success && result.printUrl) {
    return { printUrl: result.printUrl }
  }
  
  return {}
}
