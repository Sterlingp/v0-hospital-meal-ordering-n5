import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateTextReceipt, generateHtmlReceipt, generateEscPosReceipt } from '@/lib/printing'
import type { PrintableOrder } from '@/lib/printing'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, printerType = 'browser' } = body
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
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
      console.error('Error fetching order:', orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
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
    
    // Generate receipt based on printer type
    let receipt: string
    let contentType: string
    
    switch (printerType) {
      case 'escpos':
        receipt = generateEscPosReceipt(printableOrder)
        contentType = 'text/plain'
        break
      case 'text':
        receipt = generateTextReceipt(printableOrder)
        contentType = 'text/plain'
        break
      case 'html':
      case 'browser':
      default:
        receipt = generateHtmlReceipt(printableOrder)
        contentType = 'text/html'
        break
    }
    
    return NextResponse.json({
      success: true,
      receipt,
      contentType,
      orderId: order.id,
      printerType,
    })
  } catch (error) {
    console.error('Print API error:', error)
    return NextResponse.json({ error: 'Failed to generate print job' }, { status: 500 })
  }
}

// GET endpoint for direct printing (returns HTML for browser print)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const orderId = searchParams.get('orderId')
  
  if (!orderId) {
    return new NextResponse('Order ID is required', { status: 400 })
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
    return new NextResponse('Order not found', { status: 404 })
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
  
  const html = generateHtmlReceipt(printableOrder)
  
  // Add auto-print script
  const autoprint = searchParams.get('autoprint') === 'true'
  const printableHtml = autoprint
    ? html.replace('</body>', `<script>window.onload = function() { window.print(); }</script></body>`)
    : html
  
  return new NextResponse(printableHtml, {
    headers: { 'Content-Type': 'text/html' },
  })
}
