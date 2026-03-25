-- Add missing Regular Diet Breakfast items
-- Based on the Regular Diet - Breakfast Tray Ticket

-- Add breakfast meat sides (bacon, sausage, ham)
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available)
VALUES
  ('Bacon', 'Crispy bacon strips', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular']::diet_type[], ARRAY[]::text[], true),
  ('Turkey Bacon', 'Turkey bacon strips', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy']::diet_type[], ARRAY[]::text[], true),
  ('Pork Sausage', 'Pork sausage patty', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular']::diet_type[], ARRAY[]::text[], true),
  ('Turkey Sausage', 'Turkey sausage patty', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], true),
  ('Ham', 'Sliced ham', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular']::diet_type[], ARRAY[]::text[], true)
ON CONFLICT DO NOTHING;

-- Add missing breakfast bread items
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available)
VALUES
  ('Blueberry Muffin', 'Fresh blueberry muffin', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular']::diet_type[], ARRAY['wheat', 'eggs']::text[], true),
  ('Flour Tortilla', 'Soft flour tortilla', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt', 'carb_controlled']::diet_type[], ARRAY['wheat']::text[], true)
ON CONFLICT DO NOTHING;

-- Add missing spreads/condiments for breakfast
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available)
VALUES
  ('Jelly', 'Fruit jelly packet', 'condiment', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true),
  ('Sugar-Free Jelly', 'Sugar-free jelly packet', 'condiment', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt', 'renal', 'carb_controlled']::diet_type[], ARRAY[]::text[], true)
ON CONFLICT DO NOTHING;

-- Make sure Wheat Toast exists for breakfast
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available)
VALUES
  ('Wheat Toast', 'Toasted wheat bread', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt', 'carb_controlled']::diet_type[], ARRAY['wheat']::text[], true)
ON CONFLICT DO NOTHING;

-- Add Syrup options as condiments
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available)
VALUES
  ('Syrup', 'Maple syrup', 'condiment', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true),
  ('Sugar-Free Syrup', 'Sugar-free maple syrup', 'condiment', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt', 'renal', 'carb_controlled']::diet_type[], ARRAY[]::text[], true)
ON CONFLICT DO NOTHING;

-- Update Pancakes to ensure it's available for regular diet
UPDATE menu_items 
SET allowed_diets = ARRAY['regular', 'vegetarian']::diet_type[]
WHERE name = 'Pancakes' AND 'breakfast' = ANY(meal_types);

-- Make sure Ham & Cheese Omelet exists
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available)
VALUES
  ('Ham & Cheese Omelet', 'Omelet with ham and cheese', 'entree', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY['eggs', 'dairy']::text[], true)
ON CONFLICT DO NOTHING;

-- Make sure Breakfast Taco exists
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available)
VALUES
  ('Breakfast Taco', 'Flour tortilla with eggs', 'entree', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['eggs', 'wheat']::text[], true)
ON CONFLICT DO NOTHING;
