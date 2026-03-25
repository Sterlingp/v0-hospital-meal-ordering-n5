-- Clear existing menu items and insert real menu from hospital tray tickets
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM menu_items;

-- =====================================================
-- BREAKFAST ENTREES
-- =====================================================

-- Eggs - Available across most diets
INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Scrambled Eggs', 'Fluffy scrambled eggs', 'entree', ARRAY['breakfast']::meal_type[], 180, 12, 2, 320, true, ARRAY['regular', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY['eggs']),
('Scrambled Eggs (Lo-Chol)', 'Cholesterol-free egg substitute, scrambled', 'entree', ARRAY['breakfast']::meal_type[], 100, 10, 2, 280, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Fried Eggs', 'Two eggs fried to order', 'entree', ARRAY['breakfast']::meal_type[], 200, 13, 1, 340, true, ARRAY['regular', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY['eggs']),
('Fried Eggs (Lo-Chol)', 'Cholesterol-free egg substitute, fried', 'entree', ARRAY['breakfast']::meal_type[], 110, 10, 1, 290, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Hard Boiled Eggs', 'Two hard boiled eggs', 'entree', ARRAY['breakfast']::meal_type[], 155, 13, 1, 310, true, ARRAY['regular', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY['eggs']),
('Hard Boiled Eggs (Lo-Chol)', 'Cholesterol-free hard boiled style', 'entree', ARRAY['breakfast']::meal_type[], 100, 10, 1, 280, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]);

-- Pancakes
INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Pancakes', 'Fluffy buttermilk pancakes with syrup', 'entree', ARRAY['breakfast']::meal_type[], 350, 8, 58, 480, true, ARRAY['regular', 'no_added_salt', 'renal']::diet_type[], ARRAY['wheat', 'dairy']),
('Pancakes (s/f Syrup)', 'Fluffy buttermilk pancakes with sugar-free syrup', 'entree', ARRAY['breakfast']::meal_type[], 280, 8, 42, 480, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY['wheat', 'dairy']);

-- Omelets & Sandwiches
INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Ham & Cheese Omelet', 'Three-egg omelet with diced ham and melted cheese', 'entree', ARRAY['breakfast']::meal_type[], 380, 24, 3, 680, true, ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY['eggs', 'dairy']),
('Breakfast Sandwich', 'Fried egg, sausage patty, american cheese on toasted wheat bread', 'entree', ARRAY['breakfast']::meal_type[], 420, 22, 32, 720, true, ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY['eggs', 'wheat', 'dairy']),
('Breakfast Sandwich (Heart Healthy)', 'Fried egg and turkey sausage on toasted wheat bread', 'entree', ARRAY['breakfast']::meal_type[], 320, 20, 30, 540, true, ARRAY['heart_healthy']::diet_type[], ARRAY['eggs', 'wheat']),
('Breakfast Sandwich (Renal)', 'Fried egg and turkey sausage on toasted white bread, no cheese or picante sauce', 'entree', ARRAY['breakfast']::meal_type[], 300, 18, 28, 380, true, ARRAY['renal']::diet_type[], ARRAY['eggs', 'wheat']);

-- Breakfast Tacos
INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Breakfast Taco', 'Flour tortilla with scrambled eggs and choice of meat', 'entree', ARRAY['breakfast']::meal_type[], 340, 18, 28, 620, true, ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY['eggs', 'wheat']),
('Breakfast Taco (Heart Healthy)', 'Flour tortilla with eggs, turkey sausage or turkey bacon', 'entree', ARRAY['breakfast']::meal_type[], 280, 16, 26, 480, true, ARRAY['heart_healthy']::diet_type[], ARRAY['eggs', 'wheat']),
('Breakfast Taco (Renal)', 'Flour tortilla with eggs, turkey sausage or turkey bacon, no cheese or picante', 'entree', ARRAY['breakfast']::meal_type[], 260, 15, 26, 320, true, ARRAY['renal']::diet_type[], ARRAY['eggs', 'wheat']);

-- =====================================================
-- LUNCH/DINNER ENTREES
-- =====================================================

-- Steaks & Proteins
INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Ribeye Steak', 'Grilled ribeye steak', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 450, 42, 0, 380, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Hamburger Chuck Steak w/Gravy', 'Seasoned chuck steak with brown gravy', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 380, 32, 8, 580, true, ARRAY['regular']::diet_type[], ARRAY['wheat']),
('Hamburger Chuck Steak w/L/S Gravy', 'Seasoned chuck steak with low-sodium gravy', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 360, 32, 8, 280, true, ARRAY['heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat']),
('Salmon Filet', 'Baked Atlantic salmon filet', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 320, 34, 0, 280, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['fish']),
('Grilled Chicken Breast', 'Seasoned grilled chicken breast', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 280, 38, 0, 340, true, ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[]),
('Grilled Chicken Breast w/L/S Gravy', 'Grilled chicken breast with low-sodium gravy', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 300, 38, 6, 180, true, ARRAY['no_added_salt']::diet_type[], ARRAY['wheat']),
('Chicken Tenders', 'Breaded chicken tenders', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 340, 28, 18, 520, true, ARRAY['regular', 'no_added_salt']::diet_type[], ARRAY['wheat']);

-- Quesadillas
INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Chicken Quesadilla', 'Flour tortilla with grilled chicken and melted cheese', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 420, 28, 32, 680, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat', 'dairy']),
('Vegetable Quesadilla', 'Flour tortilla with sautéed vegetables and melted cheese', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 360, 14, 36, 580, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['wheat', 'dairy']);

-- Burgers & Sandwiches
INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Classic Burger', 'Beef patty on a bun', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 480, 28, 34, 620, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat']),
('Classic Burger with Cheese', 'Beef patty with American cheese on a bun', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 540, 32, 34, 720, true, ARRAY['regular']::diet_type[], ARRAY['wheat', 'dairy']),
('Veggie Burger', 'Plant-based burger patty on a bun', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 380, 18, 42, 520, true, ARRAY['vegetarian']::diet_type[], ARRAY['wheat', 'soy']),
('Grilled Chicken Sandwich', 'Grilled chicken breast on a bun', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 380, 32, 32, 540, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat']),
('Grilled Chicken Sandwich with Cheese', 'Grilled chicken breast with cheese on a bun', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 440, 36, 32, 640, true, ARRAY['regular']::diet_type[], ARRAY['wheat', 'dairy']),
('Grilled Cheese Sandwich', 'Melted cheese on toasted bread', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 380, 14, 32, 620, true, ARRAY['vegetarian']::diet_type[], ARRAY['wheat', 'dairy']);

-- Deli Sandwiches
INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Turkey Deli Sandwich', 'Sliced turkey on bread with lettuce and tomato', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 320, 24, 32, 680, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat']),
('Ham Deli Sandwich', 'Sliced ham on bread with lettuce and tomato', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 340, 22, 32, 780, true, ARRAY['regular']::diet_type[], ARRAY['wheat']),
('Tuna Salad Sandwich', 'Tuna salad on bread with lettuce', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 380, 22, 34, 580, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat', 'fish']);

-- Soups
INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Chicken Noodle Soup', 'Classic chicken noodle soup', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 180, 12, 18, 680, true, ARRAY['regular', 'heart_healthy', 'no_added_salt']::diet_type[], ARRAY['wheat']),
('Tomato Soup', 'Creamy tomato soup', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 160, 4, 22, 580, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['dairy']),
('Vegetable Broth', 'Clear vegetable broth', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 45, 2, 8, 380, true, ARRAY['vegetarian', 'renal']::diet_type[], ARRAY[]::text[]);

-- Salads
INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Gourmet Salad with Grilled Chicken', 'Mixed greens with grilled chicken breast', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 320, 32, 12, 420, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Gourmet Salad with Salmon', 'Mixed greens with baked salmon', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 340, 30, 12, 380, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['fish']);

-- Vegetarian Entrees
INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Macaroni & Cheese', 'Creamy macaroni and cheese', 'entree', ARRAY['lunch', 'dinner']::meal_type[], 420, 16, 48, 720, true, ARRAY['vegetarian']::diet_type[], ARRAY['wheat', 'dairy']);

-- =====================================================
-- SIDES
-- =====================================================

-- Hot Vegetables
INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Carrots', 'Steamed baby carrots', 'side', ARRAY['lunch', 'dinner']::meal_type[], 45, 1, 10, 80, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Broccoli', 'Steamed broccoli florets', 'side', ARRAY['lunch', 'dinner']::meal_type[], 55, 4, 10, 60, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Green Beans', 'Seasoned green beans', 'side', ARRAY['lunch', 'dinner']::meal_type[], 40, 2, 8, 120, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]);

-- Starches
INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Rice Pilaf', 'Seasoned rice pilaf', 'side', ARRAY['lunch', 'dinner']::meal_type[], 180, 4, 36, 320, true, ARRAY['regular', 'heart_healthy', 'vegetarian']::diet_type[], ARRAY[]::text[]),
('Brown Rice', 'Whole grain brown rice', 'side', ARRAY['lunch', 'dinner']::meal_type[], 170, 4, 34, 120, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Mashed Potatoes', 'Creamy mashed potatoes', 'side', ARRAY['lunch', 'dinner']::meal_type[], 180, 4, 28, 380, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['dairy']),
('Oven Baked Fries', 'Crispy oven-baked potato fries', 'side', ARRAY['lunch', 'dinner']::meal_type[], 220, 3, 32, 280, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]);

-- Breakfast Sides
INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Wheat Toast', 'Toasted wheat bread', 'side', ARRAY['breakfast']::meal_type[], 120, 4, 22, 180, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['wheat']),
('White Toast', 'Toasted white bread', 'side', ARRAY['breakfast']::meal_type[], 130, 3, 24, 200, true, ARRAY['regular', 'renal']::diet_type[], ARRAY['wheat']),
('Flour Tortilla', 'Warm flour tortilla', 'side', ARRAY['breakfast']::meal_type[], 140, 3, 24, 280, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY['wheat']),
('Blueberry Muffin', 'Fresh-baked blueberry muffin', 'side', ARRAY['breakfast']::meal_type[], 280, 4, 42, 320, true, ARRAY['regular', 'renal']::diet_type[], ARRAY['wheat', 'dairy', 'eggs']),
('Fresh Berries', 'Assorted fresh berries', 'side', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 60, 1, 14, 5, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Grapes', 'Fresh red and green grapes', 'side', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 70, 1, 18, 3, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Cottage Cheese', 'Low-fat cottage cheese', 'side', ARRAY['breakfast']::meal_type[], 110, 14, 5, 380, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'renal']::diet_type[], ARRAY['dairy']),
('Yogurt', 'Low-fat vanilla yogurt', 'side', ARRAY['breakfast']::meal_type[], 120, 6, 18, 95, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'renal']::diet_type[], ARRAY['dairy']);

-- Lunch/Dinner Cold Sides
INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Baked Chips', 'Baked potato chips', 'side', ARRAY['lunch', 'dinner']::meal_type[], 130, 2, 22, 180, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Garden Side Salad', 'Fresh mixed greens with tomato and cucumber', 'side', ARRAY['lunch', 'dinner']::meal_type[], 35, 2, 6, 25, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Fruit Cocktail', 'Mixed fruit cocktail', 'side', ARRAY['lunch', 'dinner']::meal_type[], 80, 1, 20, 10, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]);

-- =====================================================
-- BEVERAGES
-- =====================================================

INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Coffee', 'Hot brewed coffee', 'beverage', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 5, 0, 0, 5, true, ARRAY['regular', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Decaf Coffee', 'Hot decaffeinated coffee', 'beverage', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 5, 0, 0, 5, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('HOT Tea', 'Hot brewed tea', 'beverage', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 0, 0, 0, 0, true, ARRAY['regular', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Decaf HOT Tea', 'Hot decaffeinated tea', 'beverage', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 0, 0, 0, 0, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Iced Tea', 'Chilled iced tea', 'beverage', ARRAY['lunch', 'dinner']::meal_type[], 0, 0, 0, 0, true, ARRAY['regular', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Decaf Iced Tea', 'Chilled decaffeinated iced tea', 'beverage', ARRAY['lunch', 'dinner']::meal_type[], 0, 0, 0, 0, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Milk 2%', '2% reduced fat milk', 'beverage', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 120, 8, 12, 100, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY['dairy']),
('Apple Juice', 'Apple juice', 'beverage', ARRAY['breakfast']::meal_type[], 110, 0, 28, 10, true, ARRAY['regular', 'heart_healthy', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Cranberry Juice', 'Cranberry juice cocktail', 'beverage', ARRAY['breakfast']::meal_type[], 130, 0, 34, 5, true, ARRAY['regular', 'heart_healthy', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Orange Juice', 'Fresh orange juice', 'beverage', ARRAY['breakfast']::meal_type[], 110, 2, 26, 0, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[]);

-- =====================================================
-- DESSERTS
-- =====================================================

INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Gelatin', 'Fruit-flavored gelatin', 'dessert', ARRAY['lunch', 'dinner']::meal_type[], 80, 2, 19, 40, true, ARRAY['regular', 'heart_healthy', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Sugar-Free Gelatin', 'Sugar-free fruit-flavored gelatin', 'dessert', ARRAY['lunch', 'dinner']::meal_type[], 10, 2, 0, 40, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Pudding', 'Creamy vanilla or chocolate pudding', 'dessert', ARRAY['lunch', 'dinner']::meal_type[], 150, 3, 24, 180, true, ARRAY['regular', 'heart_healthy', 'no_added_salt', 'renal']::diet_type[], ARRAY['dairy']),
('Sugar-Free Pudding', 'Sugar-free vanilla or chocolate pudding', 'dessert', ARRAY['lunch', 'dinner']::meal_type[], 60, 3, 8, 180, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY['dairy']),
('Ice Cream', 'Vanilla ice cream', 'dessert', ARRAY['lunch', 'dinner']::meal_type[], 200, 4, 24, 80, true, ARRAY['regular', 'no_added_salt', 'renal']::diet_type[], ARRAY['dairy']),
('Fruit Cocktail', 'Chilled mixed fruit', 'dessert', ARRAY['lunch', 'dinner']::meal_type[], 80, 1, 20, 10, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]);

-- =====================================================
-- CONDIMENTS (stored as sides for easy selection)
-- =====================================================

INSERT INTO menu_items (name, description, category, meal_types, calories, protein_g, carbs_g, sodium_mg, is_available, allowed_diets, allergens) VALUES
('Ranch Dressing', 'Creamy ranch dressing', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 140, 1, 2, 280, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled']::diet_type[], ARRAY['dairy', 'eggs']),
('Italian Dressing', 'Light Italian dressing', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 80, 0, 4, 320, true, ARRAY['regular', 'vegetarian', 'carb_controlled']::diet_type[], ARRAY[]::text[]),
('Raspberry Vinaigrette', 'Raspberry vinaigrette dressing', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 60, 0, 8, 180, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Crackers', 'Saltine crackers', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 70, 1, 12, 180, true, ARRAY['regular', 'heart_healthy', 'vegetarian']::diet_type[], ARRAY['wheat']),
('Unsalted Crackers', 'Unsalted crackers', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 70, 1, 12, 5, true, ARRAY['no_added_salt', 'renal']::diet_type[], ARRAY['wheat']),
('Margarine', 'Soft margarine', 'condiment', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 100, 0, 0, 90, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Jelly', 'Grape or strawberry jelly', 'condiment', ARRAY['breakfast']::meal_type[], 50, 0, 13, 5, true, ARRAY['regular', 'vegetarian', 'renal']::diet_type[], ARRAY[]::text[]),
('Sugar-Free Jelly', 'Sugar-free grape or strawberry jelly', 'condiment', ARRAY['breakfast']::meal_type[], 10, 0, 3, 5, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Mustard', 'Yellow mustard', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 5, 0, 0, 55, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Mayo', 'Mayonnaise', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 100, 0, 0, 90, true, ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY['eggs']),
('BBQ Sauce', 'Barbecue sauce', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 50, 0, 12, 280, true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[]),
('Ketchup', 'Tomato ketchup', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 20, 0, 5, 160, true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[]),
('Picante Sauce', 'Mild picante sauce', 'condiment', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 10, 0, 2, 220, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled']::diet_type[], ARRAY[]::text[]),
('Sugar', 'Granulated sugar packets', 'condiment', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 15, 0, 4, 0, true, ARRAY['regular', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Sweetener', 'Sugar-free sweetener packets', 'condiment', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 0, 0, 0, 0, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Non-Dairy Creamer', 'Non-dairy creamer', 'condiment', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 20, 0, 2, 5, true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Dash Seasoning', 'Salt-free seasoning blend', 'condiment', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 0, 0, 0, 0, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]),
('Salt', 'Table salt', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], 0, 0, 0, 590, true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[]),
('Pepper', 'Ground black pepper', 'condiment', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 0, 0, 0, 0, true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'carb_controlled', 'no_added_salt', 'renal']::diet_type[], ARRAY[]::text[]);
