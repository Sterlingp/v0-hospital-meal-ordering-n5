-- Fix menu item categories and add missing items
-- 1. Update vegetables to have proper 'vegetable' category
UPDATE menu_items SET category = 'vegetable' WHERE name IN ('Carrots', 'Broccoli', 'Green Beans');

-- 2. Update starches to have proper 'starch' category  
UPDATE menu_items SET category = 'starch' WHERE name IN ('Rice Pilaf', 'Brown Rice', 'Mashed Potatoes', 'Oven Baked Fries');

-- 3. Add 'salad_addon' to category enum if not exists
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'salad_addon';

-- 4. Remove duplicates - keep only one of each item
DELETE FROM menu_items a USING menu_items b 
WHERE a.id > b.id AND a.name = b.name AND a.category = b.category;

-- 5. Remove Sugar, Sweetener, Creamer from seasonings/condiments (they are beverage_addon only)
DELETE FROM menu_items WHERE name IN ('Sugar', 'Sweetener', 'Non-Dairy Creamer') AND category IN ('seasoning', 'condiment');

-- 6. Remove Crackers from condiments (it will be a salad_addon)
DELETE FROM menu_items WHERE name = 'Crackers' AND category = 'condiment';

-- 7. Make sure beverage add-ons include Sugar
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, is_available, allergens)
SELECT 'Sugar', 'Regular sugar packet', 'beverage_addon', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 
       ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], true, ARRAY[]::text[]
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Sugar' AND category = 'beverage_addon');

-- 8. Add BBQ Sauce if missing
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, is_available, allergens)
SELECT 'BBQ Sauce', 'Tangy barbecue sauce', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 
       ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled']::diet_type[], true, ARRAY[]::text[]
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'BBQ Sauce' AND category = 'condiment');

-- 9. Add Mayo if missing  
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, is_available, allergens)
SELECT 'Mayo', 'Mayonnaise', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 
       ARRAY['regular', 'vegetarian', 'carb_controlled', 'no_added_salt']::diet_type[], true, ARRAY['eggs']::text[]
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Mayo' AND category = 'condiment');
