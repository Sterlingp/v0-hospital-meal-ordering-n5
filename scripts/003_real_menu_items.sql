-- Clear existing menu items and insert real menu from hospital tray tickets
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM menu_items;

-- =====================================================
-- BREAKFAST ENTREES
-- =====================================================

-- Eggs - Available across most diets
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Scrambled Eggs', 'Fluffy scrambled eggs', 'entree', 'breakfast', 180, 12, 2, 320, true, ARRAY['regular', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY['eggs'], NULL),
('Scrambled Eggs (Lo-Chol)', 'Cholesterol-free egg substitute, scrambled', 'entree', 'breakfast', 100, 10, 2, 280, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('Fried Eggs', 'Two eggs fried to order', 'entree', 'breakfast', 200, 13, 1, 340, true, ARRAY['regular', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY['eggs'], NULL),
('Fried Eggs (Lo-Chol)', 'Cholesterol-free egg substitute, fried', 'entree', 'breakfast', 110, 10, 1, 290, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('Hard Boiled Eggs', 'Two hard boiled eggs', 'entree', 'breakfast', 155, 13, 1, 310, true, ARRAY['regular', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY['eggs'], NULL),
('Hard Boiled Eggs (Lo-Chol)', 'Cholesterol-free hard boiled style', 'entree', 'breakfast', 100, 10, 1, 280, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL);

-- Pancakes
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Pancakes', 'Fluffy buttermilk pancakes with syrup', 'entree', 'breakfast', 350, 8, 58, 480, true, ARRAY['regular', 'no_added_salt', 'renal']::diet_type[], ARRAY['wheat', 'dairy'], NULL),
('Pancakes (s/f Syrup)', 'Fluffy buttermilk pancakes with sugar-free syrup', 'entree', 'breakfast', 280, 8, 42, 480, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY['wheat', 'dairy'], NULL);

-- Omelets & Sandwiches
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Ham & Cheese Omelet', 'Three-egg omelet with diced ham and melted cheese', 'entree', 'breakfast', 380, 24, 3, 680, true, ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY['eggs', 'dairy'], NULL),
('Breakfast Sandwich', 'Fried egg, sausage patty, american cheese on toasted wheat bread', 'entree', 'breakfast', 420, 22, 32, 720, true, ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY['eggs', 'wheat', 'dairy'], NULL),
('Breakfast Sandwich (Heart Healthy)', 'Fried egg and turkey sausage on toasted wheat bread', 'entree', 'breakfast', 320, 20, 30, 540, true, ARRAY['heart_healthy']::diet_type[], ARRAY['eggs', 'wheat'], NULL),
('Breakfast Sandwich (Renal)', 'Fried egg and turkey sausage on toasted white bread, no cheese or picante sauce', 'entree', 'breakfast', 300, 18, 28, 380, true, ARRAY['renal']::diet_type[], ARRAY['eggs', 'wheat'], NULL);

-- Breakfast Tacos
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Breakfast Taco', 'Flour tortilla with scrambled eggs and choice of meat', 'entree', 'breakfast', 340, 18, 28, 620, true, ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY['eggs', 'wheat'], NULL),
('Breakfast Taco (Heart Healthy)', 'Flour tortilla with eggs, turkey sausage or turkey bacon', 'entree', 'breakfast', 280, 16, 26, 480, true, ARRAY['heart_healthy']::diet_type[], ARRAY['eggs', 'wheat'], NULL),
('Breakfast Taco (Renal)', 'Flour tortilla with eggs, turkey sausage or turkey bacon, no cheese or picante', 'entree', 'breakfast', 260, 15, 26, 320, true, ARRAY['renal']::diet_type[], ARRAY['eggs', 'wheat'], NULL);

-- =====================================================
-- LUNCH/DINNER ENTREES
-- =====================================================

-- Steaks & Proteins
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Ribeye Steak', 'Grilled ribeye steak', 'entree', 'lunch', 450, 42, 0, 380, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], NULL),
('Ribeye Steak', 'Grilled ribeye steak', 'entree', 'dinner', 450, 42, 0, 380, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], NULL),
('Hamburger Chuck Steak w/Gravy', 'Seasoned chuck steak with brown gravy', 'entree', 'lunch', 380, 32, 8, 580, true, ARRAY['regular']::diet_type[], ARRAY['wheat'], NULL),
('Hamburger Chuck Steak w/Gravy', 'Seasoned chuck steak with brown gravy', 'entree', 'dinner', 380, 32, 8, 580, true, ARRAY['regular']::diet_type[], ARRAY['wheat'], NULL),
('Hamburger Chuck Steak w/L/S Gravy', 'Seasoned chuck steak with low-sodium gravy', 'entree', 'lunch', 360, 32, 8, 280, true, ARRAY['heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat'], NULL),
('Hamburger Chuck Steak w/L/S Gravy', 'Seasoned chuck steak with low-sodium gravy', 'entree', 'dinner', 360, 32, 8, 280, true, ARRAY['heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat'], NULL),
('Salmon Filet', 'Baked Atlantic salmon filet', 'entree', 'lunch', 320, 34, 0, 280, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['fish'], NULL),
('Salmon Filet', 'Baked Atlantic salmon filet', 'entree', 'dinner', 320, 34, 0, 280, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['fish'], NULL),
('Grilled Chicken Breast', 'Seasoned grilled chicken breast', 'entree', 'lunch', 280, 38, 0, 340, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('Grilled Chicken Breast', 'Seasoned grilled chicken breast', 'entree', 'dinner', 280, 38, 0, 340, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('Grilled Chicken Breast w/L/S Gravy', 'Grilled chicken breast with low-sodium gravy', 'entree', 'lunch', 300, 38, 6, 180, true, ARRAY['no_added_salt']::diet_type[], ARRAY['wheat'], NULL),
('Grilled Chicken Breast w/L/S Gravy', 'Grilled chicken breast with low-sodium gravy', 'entree', 'dinner', 300, 38, 6, 180, true, ARRAY['no_added_salt']::diet_type[], ARRAY['wheat'], NULL),
('Chicken Tenders', 'Breaded chicken tenders', 'entree', 'lunch', 340, 28, 18, 520, true, ARRAY['regular', 'no_added_salt']::diet_type[], ARRAY['wheat'], NULL),
('Chicken Tenders', 'Breaded chicken tenders', 'entree', 'dinner', 340, 28, 18, 520, true, ARRAY['regular', 'no_added_salt']::diet_type[], ARRAY['wheat'], NULL);

-- Quesadillas
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Chicken Quesadilla', 'Flour tortilla with grilled chicken and melted cheese', 'entree', 'lunch', 420, 28, 32, 680, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat', 'dairy'], NULL),
('Chicken Quesadilla', 'Flour tortilla with grilled chicken and melted cheese', 'entree', 'dinner', 420, 28, 32, 680, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat', 'dairy'], NULL),
('Vegetable Quesadilla', 'Flour tortilla with sautéed vegetables and melted cheese', 'entree', 'lunch', 360, 14, 36, 580, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['wheat', 'dairy'], NULL),
('Vegetable Quesadilla', 'Flour tortilla with sautéed vegetables and melted cheese', 'entree', 'dinner', 360, 14, 36, 580, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['wheat', 'dairy'], NULL);

-- Burgers & Sandwiches
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Classic Burger', 'Beef patty on a bun', 'entree', 'lunch', 480, 28, 34, 620, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat'], NULL),
('Classic Burger', 'Beef patty on a bun', 'entree', 'dinner', 480, 28, 34, 620, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat'], NULL),
('Classic Burger with Cheese', 'Beef patty with American cheese on a bun', 'entree', 'lunch', 540, 32, 34, 720, true, ARRAY['regular']::diet_type[], ARRAY['wheat', 'dairy'], NULL),
('Classic Burger with Cheese', 'Beef patty with American cheese on a bun', 'entree', 'dinner', 540, 32, 34, 720, true, ARRAY['regular']::diet_type[], ARRAY['wheat', 'dairy'], NULL),
('Veggie Burger', 'Plant-based burger patty on a bun', 'entree', 'lunch', 380, 18, 42, 520, true, ARRAY['vegetarian']::diet_type[], ARRAY['wheat', 'soy'], NULL),
('Veggie Burger', 'Plant-based burger patty on a bun', 'entree', 'dinner', 380, 18, 42, 520, true, ARRAY['vegetarian']::diet_type[], ARRAY['wheat', 'soy'], NULL),
('Grilled Chicken Sandwich', 'Grilled chicken breast on a bun', 'entree', 'lunch', 380, 32, 32, 540, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat'], NULL),
('Grilled Chicken Sandwich', 'Grilled chicken breast on a bun', 'entree', 'dinner', 380, 32, 32, 540, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat'], NULL),
('Grilled Chicken Sandwich with Cheese', 'Grilled chicken breast with cheese on a bun', 'entree', 'lunch', 440, 36, 32, 640, true, ARRAY['regular']::diet_type[], ARRAY['wheat', 'dairy'], NULL),
('Grilled Chicken Sandwich with Cheese', 'Grilled chicken breast with cheese on a bun', 'entree', 'dinner', 440, 36, 32, 640, true, ARRAY['regular']::diet_type[], ARRAY['wheat', 'dairy'], NULL),
('Grilled Cheese Sandwich', 'Melted cheese on toasted bread', 'entree', 'lunch', 380, 14, 32, 620, true, ARRAY['vegetarian']::diet_type[], ARRAY['wheat', 'dairy'], NULL),
('Grilled Cheese Sandwich', 'Melted cheese on toasted bread', 'entree', 'dinner', 380, 14, 32, 620, true, ARRAY['vegetarian']::diet_type[], ARRAY['wheat', 'dairy'], NULL);

-- Deli Sandwiches
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Turkey Deli Sandwich', 'Sliced turkey on bread with lettuce and tomato', 'entree', 'lunch', 320, 24, 32, 680, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat'], NULL),
('Turkey Deli Sandwich', 'Sliced turkey on bread with lettuce and tomato', 'entree', 'dinner', 320, 24, 32, 680, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat'], NULL),
('Ham Deli Sandwich', 'Sliced ham on bread with lettuce and tomato', 'entree', 'lunch', 340, 22, 32, 780, true, ARRAY['regular']::diet_type[], ARRAY['wheat'], NULL),
('Ham Deli Sandwich', 'Sliced ham on bread with lettuce and tomato', 'entree', 'dinner', 340, 22, 32, 780, true, ARRAY['regular']::diet_type[], ARRAY['wheat'], NULL),
('Tuna Salad Sandwich', 'Tuna salad on bread with lettuce', 'entree', 'lunch', 380, 22, 34, 580, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['wheat', 'fish'], NULL),
('Tuna Salad Sandwich', 'Tuna salad on bread with lettuce', 'entree', 'dinner', 380, 22, 34, 580, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['wheat', 'fish'], NULL);

-- Soups
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Chicken Noodle Soup', 'Classic chicken noodle soup', 'entree', 'lunch', 180, 12, 18, 680, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat'], NULL),
('Chicken Noodle Soup', 'Classic chicken noodle soup', 'entree', 'dinner', 180, 12, 18, 680, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat'], NULL),
('Tomato Soup', 'Creamy tomato soup', 'entree', 'lunch', 160, 4, 22, 580, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['dairy'], NULL),
('Tomato Soup', 'Creamy tomato soup', 'entree', 'dinner', 160, 4, 22, 580, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['dairy'], NULL),
('Vegetable Broth', 'Clear vegetable broth', 'entree', 'lunch', 45, 2, 8, 380, true, ARRAY['vegetarian', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('Vegetable Broth', 'Clear vegetable broth', 'entree', 'dinner', 45, 2, 8, 380, true, ARRAY['vegetarian', 'renal']::diet_type[], ARRAY[]::text[], NULL);

-- Salads
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Gourmet Salad with Grilled Chicken', 'Mixed greens with grilled chicken breast', 'entree', 'lunch', 320, 32, 12, 420, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], NULL),
('Gourmet Salad with Grilled Chicken', 'Mixed greens with grilled chicken breast', 'entree', 'dinner', 320, 32, 12, 420, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], NULL),
('Gourmet Salad with Salmon', 'Mixed greens with baked salmon', 'entree', 'lunch', 340, 30, 12, 380, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['fish'], NULL),
('Gourmet Salad with Salmon', 'Mixed greens with baked salmon', 'entree', 'dinner', 340, 30, 12, 380, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['fish'], NULL);

-- Vegetarian Entrees
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Macaroni & Cheese', 'Creamy macaroni and cheese', 'entree', 'lunch', 420, 16, 48, 720, true, ARRAY['vegetarian']::diet_type[], ARRAY['wheat', 'dairy'], NULL),
('Macaroni & Cheese', 'Creamy macaroni and cheese', 'entree', 'dinner', 420, 16, 48, 720, true, ARRAY['vegetarian']::diet_type[], ARRAY['wheat', 'dairy'], NULL);

-- =====================================================
-- SIDES
-- =====================================================

-- Hot Vegetables
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Carrots', 'Steamed baby carrots', 'side', 'lunch', 45, 1, 10, 80, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('Carrots', 'Steamed baby carrots', 'side', 'dinner', 45, 1, 10, 80, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('Broccoli', 'Steamed broccoli florets', 'side', 'lunch', 55, 4, 10, 60, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('Broccoli', 'Steamed broccoli florets', 'side', 'dinner', 55, 4, 10, 60, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('Green Beans', 'Seasoned green beans', 'side', 'lunch', 40, 2, 8, 120, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('Green Beans', 'Seasoned green beans', 'side', 'dinner', 40, 2, 8, 120, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL);

-- Starches
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Rice Pilaf', 'Seasoned rice pilaf', 'side', 'lunch', 180, 4, 36, 320, true, ARRAY['regular', 'heart_healthy', 'vegetarian']::diet_type[], ARRAY[]::text[], NULL),
('Rice Pilaf', 'Seasoned rice pilaf', 'side', 'dinner', 180, 4, 36, 320, true, ARRAY['regular', 'heart_healthy', 'vegetarian']::diet_type[], ARRAY[]::text[], NULL),
('Brown Rice', 'Whole grain brown rice', 'side', 'lunch', 170, 4, 34, 120, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('Brown Rice', 'Whole grain brown rice', 'side', 'dinner', 170, 4, 34, 120, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('Mashed Potatoes', 'Creamy mashed potatoes', 'side', 'lunch', 180, 4, 28, 380, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['dairy'], NULL),
('Mashed Potatoes', 'Creamy mashed potatoes', 'side', 'dinner', 180, 4, 28, 380, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['dairy'], NULL),
('Oven Baked Fries', 'Crispy oven-baked potato fries', 'side', 'lunch', 220, 3, 32, 280, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], NULL),
('Oven Baked Fries', 'Crispy oven-baked potato fries', 'side', 'dinner', 220, 3, 32, 280, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], NULL);

-- Breakfast Sides
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Wheat Toast', 'Toasted wheat bread', 'side', 'breakfast', 120, 4, 22, 180, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['wheat'], NULL),
('White Toast', 'Toasted white bread', 'side', 'breakfast', 130, 3, 24, 200, true, ARRAY['regular', 'renal']::diet_type[], ARRAY['wheat'], NULL),
('Flour Tortilla', 'Warm flour tortilla', 'side', 'breakfast', 140, 3, 24, 280, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY['wheat'], NULL),
('Blueberry Muffin', 'Fresh-baked blueberry muffin', 'side', 'breakfast', 280, 4, 42, 320, true, ARRAY['regular', 'renal']::diet_type[], ARRAY['wheat', 'dairy', 'eggs'], NULL),
('Fresh Berries', 'Assorted fresh berries', 'side', 'breakfast', 60, 1, 14, 5, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('Grapes', 'Fresh red and green grapes', 'side', 'breakfast', 70, 1, 18, 3, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('Cottage Cheese', 'Low-fat cottage cheese', 'side', 'breakfast', 110, 14, 5, 380, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'renal']::diet_type[], ARRAY['dairy'], NULL),
('Yogurt', 'Low-fat vanilla yogurt', 'side', 'breakfast', 120, 6, 18, 95, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'renal']::diet_type[], ARRAY['dairy'], NULL);

-- Lunch/Dinner Cold Sides
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Baked Chips', 'Baked potato chips', 'side', 'lunch', 120, 2, 22, 180, true, ARRAY['regular', 'heart_healthy', 'vegetarian']::diet_type[], ARRAY[]::text[], NULL),
('Baked Chips', 'Baked potato chips', 'side', 'dinner', 120, 2, 22, 180, true, ARRAY['regular', 'heart_healthy', 'vegetarian']::diet_type[], ARRAY[]::text[], NULL),
('Garden Side Salad', 'Mixed greens with tomato and cucumber', 'side', 'lunch', 45, 2, 8, 40, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], NULL),
('Garden Side Salad', 'Mixed greens with tomato and cucumber', 'side', 'dinner', 45, 2, 8, 40, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], NULL),
('Fresh Berries', 'Assorted fresh berries', 'side', 'lunch', 60, 1, 14, 5, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], NULL),
('Fresh Berries', 'Assorted fresh berries', 'side', 'dinner', 60, 1, 14, 5, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], NULL),
('Grapes', 'Fresh red and green grapes', 'side', 'lunch', 70, 1, 18, 3, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], NULL),
('Grapes', 'Fresh red and green grapes', 'side', 'dinner', 70, 1, 18, 3, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], NULL),
('Fruit Cocktail', 'Mixed fruit cocktail', 'side', 'lunch', 80, 0, 20, 10, true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[], NULL),
('Fruit Cocktail', 'Mixed fruit cocktail', 'side', 'dinner', 80, 0, 20, 10, true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[], NULL);

-- =====================================================
-- BEVERAGES
-- =====================================================

-- Hot Beverages
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Coffee', 'Fresh brewed coffee', 'beverage', 'breakfast', 5, 0, 0, 5, true, ARRAY['regular', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], NULL),
('Decaf Coffee', 'Decaffeinated coffee', 'beverage', 'breakfast', 5, 0, 0, 5, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('HOT Tea', 'Hot brewed tea', 'beverage', 'breakfast', 2, 0, 0, 5, true, ARRAY['regular', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], NULL),
('Decaf HOT Tea', 'Decaffeinated hot tea', 'beverage', 'breakfast', 2, 0, 0, 5, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('Milk 2%', '2% reduced fat milk', 'beverage', 'breakfast', 120, 8, 12, 120, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY['dairy'], NULL);

-- Cold Beverages
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Iced Tea', 'Freshly brewed iced tea', 'beverage', 'lunch', 5, 0, 1, 5, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('Iced Tea', 'Freshly brewed iced tea', 'beverage', 'dinner', 5, 0, 1, 5, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('Decaf Iced Tea', 'Decaffeinated iced tea', 'beverage', 'lunch', 5, 0, 1, 5, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('Decaf Iced Tea', 'Decaffeinated iced tea', 'beverage', 'dinner', 5, 0, 1, 5, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('Coffee', 'Fresh brewed coffee', 'beverage', 'lunch', 5, 0, 0, 5, true, ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('Coffee', 'Fresh brewed coffee', 'beverage', 'dinner', 5, 0, 0, 5, true, ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('Decaf Coffee', 'Decaffeinated coffee', 'beverage', 'lunch', 5, 0, 0, 5, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('Decaf Coffee', 'Decaffeinated coffee', 'beverage', 'dinner', 5, 0, 0, 5, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('HOT Tea', 'Hot brewed tea', 'beverage', 'lunch', 2, 0, 0, 5, true, ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('HOT Tea', 'Hot brewed tea', 'beverage', 'dinner', 2, 0, 0, 5, true, ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('Decaf HOT Tea', 'Decaffeinated hot tea', 'beverage', 'lunch', 2, 0, 0, 5, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('Decaf HOT Tea', 'Decaffeinated hot tea', 'beverage', 'dinner', 2, 0, 0, 5, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('Milk 2%', '2% reduced fat milk', 'beverage', 'lunch', 120, 8, 12, 120, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY['dairy'], NULL),
('Milk 2%', '2% reduced fat milk', 'beverage', 'dinner', 120, 8, 12, 120, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY['dairy'], NULL);

-- Juices (Breakfast)
INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Apple Juice', 'Fresh apple juice', 'beverage', 'breakfast', 110, 0, 28, 10, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('Cranberry Juice', 'Cranberry juice cocktail', 'beverage', 'breakfast', 120, 0, 30, 5, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[], NULL),
('Orange Juice', 'Fresh squeezed orange juice', 'beverage', 'breakfast', 110, 2, 26, 5, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], NULL);

-- =====================================================
-- DESSERTS
-- =====================================================

INSERT INTO menu_items (name, description, category, meal_type, calories, protein_grams, carbs_grams, sodium_mg, is_available, diet_compatibility, allergens, image_url) VALUES
('Gelatin', 'Fruit-flavored gelatin', 'dessert', 'lunch', 80, 2, 18, 40, true, ARRAY['regular', 'heart_healthy']::diet_type[], ARRAY[]::text[], NULL),
('Gelatin', 'Fruit-flavored gelatin', 'dessert', 'dinner', 80, 2, 18, 40, true, ARRAY['regular', 'heart_healthy']::diet_type[], ARRAY[]::text[], NULL),
('Sugar-Free Gelatin', 'Sugar-free fruit-flavored gelatin', 'dessert', 'lunch', 10, 2, 0, 40, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('Sugar-Free Gelatin', 'Sugar-free fruit-flavored gelatin', 'dessert', 'dinner', 10, 2, 0, 40, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], NULL),
('Pudding', 'Creamy vanilla pudding', 'dessert', 'lunch', 150, 3, 24, 180, true, ARRAY['regular', 'heart_healthy']::diet_type[], ARRAY['dairy'], NULL),
('Pudding', 'Creamy vanilla pudding', 'dessert', 'dinner', 150, 3, 24, 180, true, ARRAY['regular', 'heart_healthy']::diet_type[], ARRAY['dairy'], NULL),
('Sugar-Free Pudding', 'Sugar-free vanilla pudding', 'dessert', 'lunch', 70, 3, 10, 180, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY['dairy'], NULL),
('Sugar-Free Pudding', 'Sugar-free vanilla pudding', 'dessert', 'dinner', 70, 3, 10, 180, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY['dairy'], NULL),
('Ice Cream', 'Vanilla ice cream', 'dessert', 'lunch', 200, 4, 24, 80, true, ARRAY['regular', 'heart_healthy']::diet_type[], ARRAY['dairy'], NULL),
('Ice Cream', 'Vanilla ice cream', 'dessert', 'dinner', 200, 4, 24, 80, true, ARRAY['regular', 'heart_healthy']::diet_type[], ARRAY['dairy'], NULL),
('Fruit Cocktail', 'Mixed fruit in light syrup', 'dessert', 'lunch', 80, 0, 20, 10, true, ARRAY['regular', 'heart_healthy']::diet_type[], ARRAY[]::text[], NULL),
('Fruit Cocktail', 'Mixed fruit in light syrup', 'dessert', 'dinner', 80, 0, 20, 10, true, ARRAY['regular', 'heart_healthy']::diet_type[], ARRAY[]::text[], NULL);
