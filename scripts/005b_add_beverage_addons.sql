-- Add beverage add-ons (Sugar, Sweetener, Creamer)
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available)
VALUES
  ('Sugar', 'Sugar packet', 'beverage_addon', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
  ('Sweetener', 'Sugar-free sweetener', 'beverage_addon', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
  ('Non-Dairy Creamer', 'Non-dairy creamer', 'beverage_addon', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true)
ON CONFLICT DO NOTHING;

-- Remove duplicate condiments (keep only one of each)
DELETE FROM menu_items a USING menu_items b
WHERE a.id > b.id 
  AND a.name = b.name 
  AND a.category = b.category;
