-- Add missing entree items that have options
-- Eggs, Pancakes, Wheat Toast, Blueberry Muffin, Flour Tortilla for breakfast

-- First clean up any duplicates
DELETE FROM menu_items WHERE name IN ('Eggs', 'Pancakes', 'Wheat Toast', 'Blueberry Muffin', 'Flour Tortilla', 'Ham & Cheese Omelet');

-- Add breakfast entrees with options
INSERT INTO menu_items (name, description, category, meal_types, is_available, allowed_diets, allergens) VALUES
('Eggs', 'Prepared your way - scrambled, fried, or hard boiled', 'entree', ARRAY['breakfast']::meal_type[], true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['eggs']),
('Pancakes', 'Fluffy pancakes with your choice of syrup', 'entree', ARRAY['breakfast']::meal_type[], true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['gluten', 'eggs', 'dairy']),
('Ham & Cheese Omelet', 'Fluffy omelet with ham and melted cheese', 'entree', ARRAY['breakfast']::meal_type[], true, ARRAY['regular', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['eggs', 'dairy']),
('Wheat Toast', 'Toasted wheat bread', 'starch', ARRAY['breakfast']::meal_type[], true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['gluten']),
('Blueberry Muffin', 'Fresh baked blueberry muffin', 'starch', ARRAY['breakfast']::meal_type[], true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['gluten', 'eggs', 'dairy']),
('Flour Tortilla', 'Warm flour tortilla', 'starch', ARRAY['breakfast']::meal_type[], true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['gluten']);

-- Add/update lunch and dinner entrees with options
DELETE FROM menu_items WHERE name IN ('Quesadilla', 'Classic Burger', 'Deli Sandwich');

INSERT INTO menu_items (name, description, category, meal_types, is_available, allowed_diets, allergens) VALUES
('Quesadilla', 'Cheese quesadilla with your choice of filling', 'entree', ARRAY['lunch', 'dinner']::meal_type[], true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['gluten', 'dairy']),
('Classic Burger', 'Beef patty on a bun with lettuce and tomato', 'entree', ARRAY['lunch', 'dinner']::meal_type[], true, ARRAY['regular']::diet_type[], ARRAY['gluten']),
('Deli Sandwich', 'Your choice of meat on fresh bread', 'entree', ARRAY['lunch', 'dinner']::meal_type[], true, ARRAY['regular', 'heart_healthy']::diet_type[], ARRAY['gluten']);

-- Clean up duplicate sugars from beverage_addon
DELETE FROM menu_items 
WHERE category = 'beverage_addon' 
AND name = 'Sugar' 
AND id NOT IN (SELECT MIN(id) FROM menu_items WHERE category = 'beverage_addon' AND name = 'Sugar');
