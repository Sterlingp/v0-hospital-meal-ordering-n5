// ESC/POS Printing utilities for thermal receipt printers
// Supports both direct ESC/POS and cloud-based printing

import type { Patient, MenuItem, MealType } from './types'
import { MEAL_LABELS } from './types'

// ESC/POS command codes
export const ESC = '\x1B'
export const GS = '\x1D'
export const LF = '\x0A'
export const CR = '\x0D'

// ESC/POS formatting commands
export const ESCPOS = {
  // Initialization
  INIT: `${ESC}@`,
  
  // Text alignment
  ALIGN_LEFT: `${ESC}a\x00`,
  ALIGN_CENTER: `${ESC}a\x01`,
  ALIGN_RIGHT: `${ESC}a\x02`,
  
  // Text style
  BOLD_ON: `${ESC}E\x01`,
  BOLD_OFF: `${ESC}E\x00`,
  DOUBLE_HEIGHT_ON: `${GS}!\x10`,
  DOUBLE_WIDTH_ON: `${GS}!\x20`,
  DOUBLE_SIZE_ON: `${GS}!\x30`,
  NORMAL_SIZE: `${GS}!\x00`,
  UNDERLINE_ON: `${ESC}-\x01`,
  UNDERLINE_OFF: `${ESC}-\x00`,
  
  // Paper handling
  CUT: `${GS}V\x00`,
  PARTIAL_CUT: `${GS}V\x01`,
  FEED_LINES: (n: number) => `${ESC}d${String.fromCharCode(n)}`,
  
  // Character size
  FONT_A: `${ESC}M\x00`,
  FONT_B: `${ESC}M\x01`,
}

export interface PrinterConfig {
  id: string
  name: string
  type: 'escpos' | 'cloud' | 'browser'
  endpoint?: string // For cloud printing (URL) or ESC/POS (IP:port)
  apiKey?: string // For cloud print services
  enabled: boolean
  autoPrint: boolean
}

export interface OrderItem {
  id: string
  menu_item: MenuItem
  quantity: number
  notes?: string
}

export interface PrintableOrder {
  id: string
  patient: Patient
  mealType: MealType
  orderDate: string
  items: OrderItem[]
  specialRequests?: string | null
  createdAt: string
}

// Generate ESC/POS formatted receipt
export function generateEscPosReceipt(order: PrintableOrder): string {
  const lines: string[] = []
  
  // Initialize printer
  lines.push(ESCPOS.INIT)
  
  // Hospital header
  lines.push(ESCPOS.ALIGN_CENTER)
  lines.push(ESCPOS.DOUBLE_SIZE_ON)
  lines.push('EAST HOUSTON')
  lines.push('MEDICAL CENTER')
  lines.push(ESCPOS.NORMAL_SIZE)
  lines.push(ESCPOS.FEED_LINES(1))
  
  // Meal type and date
  lines.push(ESCPOS.BOLD_ON)
  lines.push(ESCPOS.DOUBLE_HEIGHT_ON)
  lines.push(`${MEAL_LABELS[order.mealType].toUpperCase()} ORDER`)
  lines.push(ESCPOS.NORMAL_SIZE)
  lines.push(ESCPOS.BOLD_OFF)
  lines.push(ESCPOS.FEED_LINES(1))
  
  // Separator
  lines.push('================================')
  lines.push(ESCPOS.FEED_LINES(1))
  
  // Patient info
  lines.push(ESCPOS.ALIGN_LEFT)
  lines.push(ESCPOS.BOLD_ON)
  lines.push(ESCPOS.DOUBLE_SIZE_ON)
  lines.push(`ROOM: ${order.patient.room_number}`)
  lines.push(ESCPOS.NORMAL_SIZE)
  lines.push(ESCPOS.BOLD_OFF)
  lines.push(ESCPOS.FEED_LINES(1))
  
  lines.push(`Patient: ${order.patient.first_name} ${order.patient.last_name}`)
  lines.push(`Diet: ${formatDietType(order.patient.diet_type)}`)
  
  if (order.patient.allergies.length > 0) {
    lines.push(ESCPOS.BOLD_ON)
    lines.push(`ALLERGIES: ${order.patient.allergies.join(', ')}`)
    lines.push(ESCPOS.BOLD_OFF)
  }
  
  lines.push(ESCPOS.FEED_LINES(1))
  lines.push('--------------------------------')
  lines.push(ESCPOS.FEED_LINES(1))
  
  // Order items
  lines.push(ESCPOS.BOLD_ON)
  lines.push('ORDER ITEMS:')
  lines.push(ESCPOS.BOLD_OFF)
  lines.push(ESCPOS.FEED_LINES(1))
  
  // Group items by category for clarity
  const categorizedItems = groupItemsByCategory(order.items)
  
  for (const [category, items] of Object.entries(categorizedItems)) {
    if (items.length > 0) {
      lines.push(ESCPOS.UNDERLINE_ON)
      lines.push(`${formatCategory(category)}:`)
      lines.push(ESCPOS.UNDERLINE_OFF)
      
      for (const item of items) {
        lines.push(`  - ${item.menu_item.name}`)
        if (item.notes) {
          lines.push(`    (${item.notes})`)
        }
      }
      lines.push('')
    }
  }
  
  lines.push(ESCPOS.FEED_LINES(1))
  
  // Special requests
  if (order.specialRequests) {
    lines.push('--------------------------------')
    lines.push(ESCPOS.BOLD_ON)
    lines.push('SPECIAL REQUESTS:')
    lines.push(ESCPOS.BOLD_OFF)
    lines.push(order.specialRequests)
    lines.push(ESCPOS.FEED_LINES(1))
  }
  
  // Footer
  lines.push('--------------------------------')
  lines.push(ESCPOS.ALIGN_CENTER)
  lines.push(`Order #${order.id.slice(0, 8).toUpperCase()}`)
  lines.push(`Date: ${formatDate(order.orderDate)}`)
  lines.push(`Printed: ${formatDateTime(new Date().toISOString())}`)
  lines.push(ESCPOS.FEED_LINES(3))
  
  // Cut paper
  lines.push(ESCPOS.PARTIAL_CUT)
  
  return lines.join(LF)
}

// Generate plain text receipt (for browser/cloud printing)
export function generateTextReceipt(order: PrintableOrder): string {
  const lines: string[] = []
  const width = 42 // Standard thermal printer width
  
  // Helper to center text
  const center = (text: string) => {
    const padding = Math.max(0, Math.floor((width - text.length) / 2))
    return ' '.repeat(padding) + text
  }
  
  // Helper for separator
  const separator = '='.repeat(width)
  const dottedSeparator = '-'.repeat(width)
  
  // Header
  lines.push(center('EAST HOUSTON MEDICAL CENTER'))
  lines.push(center('Patient Meal Service'))
  lines.push('')
  lines.push(center(`*** ${MEAL_LABELS[order.mealType].toUpperCase()} ORDER ***`))
  lines.push('')
  lines.push(separator)
  
  // Patient info
  lines.push('')
  lines.push(`ROOM: ${order.patient.room_number}`.padEnd(width))
  lines.push(`Patient: ${order.patient.first_name} ${order.patient.last_name}`)
  lines.push(`Diet Type: ${formatDietType(order.patient.diet_type)}`)
  
  if (order.patient.allergies.length > 0) {
    lines.push('')
    lines.push(`*** ALLERGIES: ${order.patient.allergies.join(', ')} ***`)
  }
  
  lines.push('')
  lines.push(dottedSeparator)
  lines.push('')
  
  // Order items
  lines.push('ORDER ITEMS:')
  lines.push('')
  
  const categorizedItems = groupItemsByCategory(order.items)
  
  for (const [category, items] of Object.entries(categorizedItems)) {
    if (items.length > 0) {
      lines.push(`[${formatCategory(category)}]`)
      for (const item of items) {
        lines.push(`  - ${item.menu_item.name}`)
        if (item.notes) {
          lines.push(`    Note: ${item.notes}`)
        }
      }
      lines.push('')
    }
  }
  
  // Special requests
  if (order.specialRequests) {
    lines.push(dottedSeparator)
    lines.push('')
    lines.push('SPECIAL REQUESTS:')
    lines.push(order.specialRequests)
    lines.push('')
  }
  
  // Footer
  lines.push(separator)
  lines.push('')
  lines.push(center(`Order #${order.id.slice(0, 8).toUpperCase()}`))
  lines.push(center(`Delivery Date: ${formatDate(order.orderDate)}`))
  lines.push(center(`Printed: ${formatDateTime(new Date().toISOString())}`))
  lines.push('')
  lines.push('')
  lines.push('')
  
  return lines.join('\n')
}

// Generate HTML receipt for browser printing
export function generateHtmlReceipt(order: PrintableOrder): string {
  const categorizedItems = groupItemsByCategory(order.items)
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Meal Order - Room ${order.patient.room_number}</title>
  <style>
    @page { 
      size: 80mm auto; 
      margin: 5mm;
    }
    body {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      width: 72mm;
      margin: 0 auto;
      padding: 5mm;
    }
    .header {
      text-align: center;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .hospital-name {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .meal-type {
      font-size: 18px;
      border: 2px solid black;
      padding: 5px;
      margin: 10px 0;
    }
    .separator {
      border-top: 1px dashed black;
      margin: 10px 0;
    }
    .patient-info {
      margin-bottom: 10px;
    }
    .room {
      font-size: 24px;
      font-weight: bold;
    }
    .allergies {
      background: #ffcccc;
      padding: 5px;
      font-weight: bold;
      border: 1px solid red;
      margin: 5px 0;
    }
    .items-section {
      margin: 10px 0;
    }
    .category {
      font-weight: bold;
      text-decoration: underline;
      margin-top: 8px;
    }
    .item {
      margin-left: 10px;
    }
    .special-requests {
      background: #ffffcc;
      padding: 5px;
      border: 1px solid #cc0;
      margin: 10px 0;
    }
    .footer {
      text-align: center;
      font-size: 10px;
      margin-top: 15px;
    }
    @media print {
      body { print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="hospital-name">EAST HOUSTON MEDICAL CENTER</div>
    <div>Patient Meal Service</div>
    <div class="meal-type">${MEAL_LABELS[order.mealType].toUpperCase()} ORDER</div>
  </div>
  
  <div class="separator"></div>
  
  <div class="patient-info">
    <div class="room">ROOM: ${order.patient.room_number}</div>
    <div>Patient: ${order.patient.first_name} ${order.patient.last_name}</div>
    <div>Diet: ${formatDietType(order.patient.diet_type)}</div>
    ${order.patient.allergies.length > 0 ? `
      <div class="allergies">
        ALLERGIES: ${order.patient.allergies.join(', ')}
      </div>
    ` : ''}
  </div>
  
  <div class="separator"></div>
  
  <div class="items-section">
    <strong>ORDER ITEMS:</strong>
    ${Object.entries(categorizedItems).map(([category, items]) => 
      items.length > 0 ? `
        <div class="category">${formatCategory(category)}:</div>
        ${items.map(item => `
          <div class="item">- ${item.menu_item.name}</div>
          ${item.notes ? `<div class="item" style="font-size:10px;margin-left:20px;">(${item.notes})</div>` : ''}
        `).join('')}
      ` : ''
    ).join('')}
  </div>
  
  ${order.specialRequests ? `
    <div class="separator"></div>
    <div class="special-requests">
      <strong>SPECIAL REQUESTS:</strong><br>
      ${order.specialRequests}
    </div>
  ` : ''}
  
  <div class="separator"></div>
  
  <div class="footer">
    <div>Order #${order.id.slice(0, 8).toUpperCase()}</div>
    <div>Delivery Date: ${formatDate(order.orderDate)}</div>
    <div>Printed: ${formatDateTime(new Date().toISOString())}</div>
  </div>
</body>
</html>
  `.trim()
}

// Helper functions
function formatDietType(dietType: string): string {
  const labels: Record<string, string> = {
    regular: 'Regular',
    heart_healthy: 'Heart Healthy',
    renal: 'Renal',
    carb_controlled: 'Carb Controlled',
    vegetarian: 'Vegetarian',
    no_added_salt: 'No Added Salt',
  }
  return labels[dietType] || dietType
}

function formatCategory(category: string): string {
  const labels: Record<string, string> = {
    entree: 'Entree',
    soup: 'Soup',
    salad: 'Salad',
    dressing: 'Dressing',
    vegetable: 'Vegetable',
    starch: 'Starch',
    side: 'Side',
    condiment: 'Condiment',
    seasoning: 'Seasoning',
    beverage: 'Beverage',
    beverage_addon: 'Beverage Add-on',
    dessert: 'Dessert',
  }
  return labels[category] || category
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function groupItemsByCategory(items: OrderItem[]): Record<string, OrderItem[]> {
  const order = ['entree', 'soup', 'salad', 'dressing', 'vegetable', 'starch', 'side', 'condiment', 'seasoning', 'beverage', 'beverage_addon', 'dessert']
  
  const grouped: Record<string, OrderItem[]> = {}
  
  for (const cat of order) {
    grouped[cat] = []
  }
  
  for (const item of items) {
    const cat = item.menu_item.category
    if (!grouped[cat]) {
      grouped[cat] = []
    }
    grouped[cat].push(item)
  }
  
  return grouped
}
