import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const updates = [
  { name: 'Baked Chips', image_url: '/menu-images/baked-chips.jpg' },
  { name: 'Coffee', image_url: '/menu-images/coffee.jpg' },
  { name: 'Decaf Coffee', image_url: '/menu-images/coffee.jpg' },
  { name: 'Dash Seasoning', image_url: '/menu-images/dash-seasoning.jpg' },
  { name: 'Flour Tortilla', image_url: '/menu-images/flour-tortilla.jpg' },
  { name: 'Gelatin', image_url: '/menu-images/gelatin.jpg' },
  { name: 'Ketchup', image_url: '/menu-images/ketchup.jpg' },
  { name: 'Sugar-Free Gelatin', image_url: '/menu-images/sugar-free-gelatin.jpg' },
  { name: 'Yogurt', image_url: '/menu-images/yogurt.jpg' },
]

async function updateImageUrls() {
  for (const item of updates) {
    const { error } = await supabase
      .from('menu_items')
      .update({ image_url: item.image_url })
      .eq('name', item.name)

    if (error) {
      console.error(`Error updating ${item.name}:`, error)
    } else {
      console.log(`Updated ${item.name}`)
    }
  }

  // Verify no more Supabase URLs
  const { data, error } = await supabase
    .from('menu_items')
    .select('name, image_url')
    .like('image_url', '%supabase%')

  if (error) {
    console.error('Error checking:', error)
  } else {
    console.log(`Remaining Supabase URLs: ${data?.length || 0}`)
  }
}

updateImageUrls()
