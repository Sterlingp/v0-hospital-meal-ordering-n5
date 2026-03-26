-- Remove duplicate menu items, keeping only the first one
DELETE FROM menu_items a USING menu_items b
WHERE a.id > b.id AND a.name = b.name AND a.category = b.category;

-- Ensure BBQ Sauce and Mayo exist (in case they were deleted)
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available)
VALUES 
  ('BBQ Sauce', 'Tangy barbecue sauce', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[], true),
  ('Mayo', 'Mayonnaise', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'vegetarian', 'carb_controlled']::diet_type[], ARRAY['eggs']::text[], true)
ON CONFLICT DO NOTHING;

-- Add beverage add-ons as a new category
-- First update the category type if needed
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'beverage_addon';

-- Insert beverage add-ons (Sugar, Sweetener, Creamer for coffee/tea)
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available)
VALUES 
  ('Sugar', 'Sugar packet', 'beverage_addon', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true),
  ('Sweetener', 'Sugar-free sweetener packet', 'beverage_addon', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true),
  ('Non-Dairy Creamer', 'Coffee creamer cup', 'beverage_addon', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true)
ON CONFLICT DO NOTHING;

-- Remove sugar/sweetener/creamer from seasonings category (they should only be beverage add-ons)
DELETE FROM menu_items WHERE name IN ('Sugar', 'Sweetener', 'Non-Dairy Creamer') AND category = 'seasoning';
