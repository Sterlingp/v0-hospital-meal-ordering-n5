import { NextRequest, NextResponse } from 'next/server'
import { generateHtmlReceipt, generateTextReceipt, type PrintableOrder } from '@/lib/printing'

// Generate a sample order for testing
function getSampleOrder(): PrintableOrder {
  return {
    id: 'TEST-ORDER-12345678',
    patient: {
      id: 'test-patient',
      first_name: 'Test',
      last_name: 'Patient',
      room_number: '101-A',
      diet_type: 'regular',
      allergies: ['Peanuts', 'Shellfish'],
      special_instructions: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    mealType: 'lunch',
    orderDate: new Date().toISOString().split('T')[0],
    items: [
      {
        id: '1',
        menu_item: {
          id: '1',
          name: 'Grilled Chicken Breast',
          description: null,
          meal_types: ['lunch', 'dinner'],
          category: 'entree',
          image_url: null,
          calories: 350,
          protein_g: 40,
          carbs_g: 0,
          fat_g: 8,
          sodium_mg: 200,
          is_available: true,
          allowed_diets: ['regular'],
          allergens: [],
          is_vegetarian: false,
          is_sugar_free: true,
          is_low_sodium: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        quantity: 1,
      },
      {
        id: '2',
        menu_item: {
          id: '2',
          name: 'Mashed Potatoes',
          description: null,
          meal_types: ['lunch', 'dinner'],
          category: 'starch',
          image_url: null,
          calories: 150,
          protein_g: 3,
          carbs_g: 30,
          fat_g: 5,
          sodium_mg: 100,
          is_available: true,
          allowed_diets: ['regular'],
          allergens: ['dairy'],
          is_vegetarian: true,
          is_sugar_free: true,
          is_low_sodium: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        quantity: 1,
      },
      {
        id: '3',
        menu_item: {
          id: '3',
          name: 'Broccoli',
          description: null,
          meal_types: ['lunch', 'dinner'],
          category: 'vegetable',
          image_url: null,
          calories: 50,
          protein_g: 4,
          carbs_g: 10,
          fat_g: 0,
          sodium_mg: 30,
          is_available: true,
          allowed_diets: ['regular'],
          allergens: [],
          is_vegetarian: true,
          is_sugar_free: true,
          is_low_sodium: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        quantity: 1,
      },
      {
        id: '4',
        menu_item: {
          id: '4',
          name: 'Iced Tea',
          description: null,
          meal_types: ['lunch', 'dinner'],
          category: 'beverage',
          image_url: null,
          calories: 0,
          protein_g: 0,
          carbs_g: 0,
          fat_g: 0,
          sodium_mg: 0,
          is_available: true,
          allowed_diets: ['regular'],
          allergens: [],
          is_vegetarian: true,
          is_sugar_free: true,
          is_low_sodium: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        quantity: 1,
      },
    ],
    specialRequests: 'Please cut chicken into small pieces',
    createdAt: new Date().toISOString(),
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') || 'browser'
  const autoprint = searchParams.get('autoprint') === 'true'
  
  const sampleOrder = getSampleOrder()
  
  if (type === 'text') {
    const text = generateTextReceipt(sampleOrder)
    return new NextResponse(text, {
      headers: { 'Content-Type': 'text/plain' },
    })
  }
  
  let html = generateHtmlReceipt(sampleOrder)
  
  // Add test banner
  html = html.replace(
    '<body>',
    `<body>
      <div style="background: #ffcc00; color: black; text-align: center; padding: 10px; font-weight: bold; margin-bottom: 10px;">
        *** TEST PRINT - NOT A REAL ORDER ***
      </div>`
  )
  
  if (autoprint) {
    html = html.replace(
      '</body>',
      `<script>window.onload = function() { window.print(); }</script></body>`
    )
  }
  
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
