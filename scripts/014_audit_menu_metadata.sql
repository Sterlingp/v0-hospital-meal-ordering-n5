-- Audit corrections for menu metadata after reviewing allowed_diets/allergens
-- This script updates the existing menu_items data in-place.

-- Carb-controlled patients should not receive the standalone bread/starch items.
UPDATE menu_items
SET allowed_diets = ARRAY['regular', 'heart_healthy', 'renal', 'vegetarian', 'no_added_salt']::diet_type[]
WHERE name = 'Wheat Toast'
  AND category = 'starch'
  AND meal_types = ARRAY['breakfast']::meal_type[];

UPDATE menu_items
SET allowed_diets = ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[]
WHERE name = 'Baked Potato'
  AND category = 'starch'
  AND meal_types = ARRAY['lunch', 'dinner']::meal_type[];

-- Pancakes are a regular/vegetarian breakfast entree in the current menu model.
UPDATE menu_items
SET allowed_diets = ARRAY['regular', 'vegetarian']::diet_type[]
WHERE name = 'Pancakes'
  AND category = 'entree'
  AND meal_types = ARRAY['breakfast']::meal_type[];

-- Protein-focused breakfast items can remain available for carb-controlled diets.
UPDATE menu_items
SET allowed_diets = ARRAY['regular', 'carb_controlled']::diet_type[]
WHERE name = 'Ham & Cheese Omelet'
  AND category = 'entree'
  AND meal_types = ARRAY['breakfast']::meal_type[];

UPDATE menu_items
SET allowed_diets = ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[]
WHERE name = 'Turkey Bacon'
  AND category = 'side'
  AND meal_types = ARRAY['breakfast']::meal_type[];

UPDATE menu_items
SET allowed_diets = ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[]
WHERE name = 'Turkey Sausage'
  AND category = 'side'
  AND meal_types = ARRAY['breakfast']::meal_type[];
