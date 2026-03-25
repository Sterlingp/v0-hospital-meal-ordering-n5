-- Add Sugar to beverage add-ons
INSERT INTO menu_items (name, category, meal_types, allowed_diets, is_available, allergens)
VALUES ('Sugar', 'beverage_addon', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 
        ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], true, ARRAY[]::text[])
ON CONFLICT DO NOTHING;

-- Add dressings (move from condiments to dressing category)
UPDATE menu_items SET category = 'dressing' WHERE name IN ('Ranch Dressing', 'Italian Dressing', 'Raspberry Vinaigrette');

-- Insert dressings if they don't exist
INSERT INTO menu_items (name, category, meal_types, allowed_diets, is_available, allergens)
VALUES 
  ('Ranch Dressing', 'dressing', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian']::diet_type[], true, ARRAY['dairy']::text[]),
  ('Italian Dressing', 'dressing', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], true, ARRAY[]::text[]),
  ('Raspberry Vinaigrette', 'dressing', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], true, ARRAY[]::text[])
ON CONFLICT DO NOTHING;

-- Add salad add-ons (crackers, chicken, salmon for protein)
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, is_available, allergens)
VALUES 
  ('Crackers', 'Saltine crackers', 'salad_addon', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian']::diet_type[], true, ARRAY['wheat']::text[]),
  ('Unsalted Crackers', 'Unsalted crackers for restricted diets', 'salad_addon', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['no_added_salt', 'renal']::diet_type[], true, ARRAY['wheat']::text[]),
  ('Grilled Chicken', 'Add grilled chicken breast to your salad', 'salad_addon', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'no_added_salt']::diet_type[], true, ARRAY[]::text[]),
  ('Salmon', 'Add salmon filet to your salad', 'salad_addon', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], true, ARRAY['fish']::text[])
ON CONFLICT DO NOTHING;

-- Remove crackers, sugar, sweetener, creamer from condiments and seasonings
DELETE FROM menu_items 
WHERE name IN ('Crackers', 'Unsalted Crackers', 'Sugar', 'Sweetener', 'Non-Dairy Creamer') 
AND category IN ('condiment', 'seasoning');

-- Make sure we have the gourmet salads
UPDATE menu_items SET category = 'salad' WHERE name LIKE '%Salad%' AND name LIKE '%Gourmet%';
UPDATE menu_items SET category = 'salad' WHERE name = 'Garden Side Salad';
