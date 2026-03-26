-- Add water to beverages
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available)
VALUES 
  ('Water', 'Refreshing ice water', 'beverage', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], 
   ARRAY[]::text[], true)
ON CONFLICT DO NOTHING;

-- Add condiments/dressings that are allowed for most diets
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available)
VALUES 
  ('Ranch Dressing', 'Creamy ranch dressing', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'vegetarian', 'carb_controlled']::diet_type[], ARRAY['dairy', 'eggs']::text[], true),
  ('Italian Dressing', 'Light Italian vinaigrette', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
  ('Raspberry Vinaigrette', 'Sweet raspberry dressing', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true),
  ('Margarine', 'Butter substitute', 'condiment', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY['dairy']::text[], true),
  ('Mustard', 'Yellow mustard', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true),
  ('Mayo', 'Mayonnaise', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'vegetarian', 'carb_controlled']::diet_type[], ARRAY['eggs']::text[], true),
  ('BBQ Sauce', 'Tangy barbecue sauce', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[], true),
  ('Ketchup', 'Tomato ketchup', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'vegetarian', 'heart_healthy']::diet_type[], ARRAY[]::text[], true),
  ('Picante Sauce', 'Spicy salsa', 'condiment', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'vegetarian', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], true),
  ('Jelly', 'Grape jelly', 'condiment', ARRAY['breakfast']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true),
  ('Sugar-Free Jelly', 'Sugar-free grape jelly', 'condiment', ARRAY['breakfast']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true),
  ('Syrup', 'Maple-flavored syrup', 'condiment', ARRAY['breakfast']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true),
  ('Sugar-Free Syrup', 'Sugar-free maple syrup', 'condiment', ARRAY['breakfast']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true)
ON CONFLICT DO NOTHING;

-- Add seasonings
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available)
VALUES 
  ('Salt', 'Table salt packet', 'seasoning', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'vegetarian', 'carb_controlled']::diet_type[], ARRAY[]::text[], true),
  ('Pepper', 'Ground black pepper', 'seasoning', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true),
  ('Dash Seasoning', 'Salt-free herb seasoning blend', 'seasoning', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true),
  ('Sugar', 'Sugar packets', 'seasoning', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true),
  ('Sweetener', 'Sugar substitute packets', 'seasoning', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true),
  ('Non-Dairy Creamer', 'Coffee creamer', 'seasoning', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], true),
  ('Crackers', 'Saltine crackers', 'seasoning', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'vegetarian', 'heart_healthy']::diet_type[], ARRAY['wheat']::text[], true),
  ('Unsalted Crackers', 'Unsalted crackers', 'seasoning', ARRAY['lunch', 'dinner']::meal_type[], 
   ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY['wheat']::text[], true)
ON CONFLICT DO NOTHING;

-- Update sides to have subcategory tags in description for vegetable vs starch identification
UPDATE menu_items SET description = 'Steamed carrots (vegetable)' WHERE name = 'Carrots' AND category = 'side';
UPDATE menu_items SET description = 'Steamed broccoli florets (vegetable)' WHERE name = 'Broccoli' AND category = 'side';
UPDATE menu_items SET description = 'Tender green beans (vegetable)' WHERE name = 'Green Beans' AND category = 'side';
UPDATE menu_items SET description = 'Fluffy white rice pilaf (starch)' WHERE name = 'Rice Pilaf' AND category = 'side';
UPDATE menu_items SET description = 'Nutty brown rice (starch)' WHERE name = 'Brown Rice' AND category = 'side';
UPDATE menu_items SET description = 'Creamy mashed potatoes (starch)' WHERE name = 'Mashed Potatoes' AND category = 'side';
UPDATE menu_items SET description = 'Crispy oven-baked fries (starch)' WHERE name = 'Oven Baked Fries' AND category = 'side';
UPDATE menu_items SET description = 'Fresh garden salad (vegetable)' WHERE name = 'Garden Side Salad' AND category = 'side';
