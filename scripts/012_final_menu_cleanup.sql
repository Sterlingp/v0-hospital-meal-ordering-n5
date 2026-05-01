-- Final menu cleanup - remove items not on original menus and fix duplicates
-- Clear existing orders first
DELETE FROM order_items;
DELETE FROM orders;

-- Remove all menu items and start fresh with correct items
DELETE FROM menu_items;

-- ============================================
-- BREAKFAST ENTREES
-- ============================================
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available) VALUES
-- Eggs (has options - Regular/Lo-Chol, Scrambled/Fried/Hard Boiled)
('Eggs', 'Choose preparation style', 'entree', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['eggs'], true),
-- Pancakes (has options - Regular Syrup/Sugar-Free Syrup)
('Pancakes', 'Served with your choice of syrup', 'entree', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['wheat', 'eggs', 'milk'], true),
-- Breakfast Sandwich
('Breakfast Sandwich', 'Fried egg, sausage patty, american cheese on toasted wheat bread', 'entree', ARRAY['breakfast']::meal_type[], ARRAY['regular']::diet_type[], ARRAY['wheat', 'eggs', 'milk'], true),
-- Ham & Cheese Omelet
('Ham & Cheese Omelet', 'Fluffy omelet with ham and cheese', 'entree', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY['eggs', 'milk'], true),
-- Breakfast Taco (has options - proteins and extras)
('Breakfast Taco', 'Choose your protein and extras', 'entree', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['wheat', 'eggs'], true);

-- ============================================
-- BREAKFAST BREADS/STARCHES (with spread options)
-- ============================================
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available) VALUES
('Wheat Toast', 'Choose your spread', 'starch', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['wheat'], true),
('Blueberry Muffin', 'Fresh baked, choose your spread', 'starch', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['wheat', 'eggs', 'milk'], true),
('Flour Tortilla', 'Warm tortilla, choose your spread', 'starch', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['wheat'], true);

-- ============================================
-- BREAKFAST SIDES
-- ============================================
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available) VALUES
('Fresh Berries', 'Seasonal fresh berries', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Grapes', 'Fresh grapes', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Cottage Cheese', 'Creamy cottage cheese', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian']::diet_type[], ARRAY['milk'], true),
('Yogurt', 'Creamy yogurt', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian']::diet_type[], ARRAY['milk'], true),
('Bacon', 'Crispy bacon strips', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular']::diet_type[], ARRAY[]::text[], true),
('Turkey Bacon', 'Lean turkey bacon', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], true),
('Pork Sausage', 'Savory pork sausage', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular']::diet_type[], ARRAY[]::text[], true),
('Turkey Sausage', 'Lean turkey sausage', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular', 'heart_healthy', 'carb_controlled']::diet_type[], ARRAY[]::text[], true),
('Ham', 'Sliced ham', 'side', ARRAY['breakfast']::meal_type[], ARRAY['regular']::diet_type[], ARRAY[]::text[], true);

-- ============================================
-- LUNCH/DINNER ENTREES  
-- ============================================
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available) VALUES
-- Chicken Dishes
('Baked Chicken', 'Herb-seasoned baked chicken breast', 'entree', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Grilled Chicken Breast', 'Seasoned grilled chicken', 'entree', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
-- Fish
('Baked Fish', 'Lightly seasoned baked fish fillet', 'entree', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['fish'], true),
('Salmon', 'Grilled Atlantic salmon', 'entree', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['fish'], true),
-- Beef
('Meatloaf', 'Homestyle meatloaf', 'entree', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular']::diet_type[], ARRAY['wheat', 'eggs'], true),
('Roast Beef', 'Tender sliced roast beef', 'entree', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY[]::text[], true),
('Classic Burger', 'Beef patty on a bun, add cheese option', 'entree', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular']::diet_type[], ARRAY['wheat'], true),
-- Sandwiches
('Deli Sandwich', 'Choose turkey, tuna salad, or ham', 'entree', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy']::diet_type[], ARRAY['wheat'], true),
-- Mexican
('Quesadilla', 'Choose chicken or vegetable filling', 'entree', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['wheat', 'milk'], true),
-- Pasta
('Spaghetti', 'Pasta with marinara sauce', 'entree', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'vegetarian', 'heart_healthy']::diet_type[], ARRAY['wheat'], true);

-- ============================================
-- SALADS (can be entree with protein options)
-- ============================================
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available) VALUES
('Garden Salad', 'Fresh mixed greens - add grilled chicken or salmon', 'salad', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true);

-- ============================================
-- SOUPS
-- ============================================
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available) VALUES
('Chicken Noodle Soup', 'Classic chicken noodle soup', 'soup', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy']::diet_type[], ARRAY['wheat'], true),
('Tomato Soup', 'Creamy tomato soup', 'soup', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['milk'], true),
('Vegetable Soup', 'Hearty vegetable soup', 'soup', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true);

-- ============================================
-- VEGETABLES
-- ============================================
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available) VALUES
('Steamed Broccoli', 'Fresh steamed broccoli', 'vegetable', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Green Beans', 'Seasoned green beans', 'vegetable', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Glazed Carrots', 'Sweet glazed carrots', 'vegetable', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Mixed Vegetables', 'Seasonal mixed vegetables', 'vegetable', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true);

-- ============================================
-- STARCHES (Lunch/Dinner)
-- ============================================
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available) VALUES
('Rice Pilaf', 'Seasoned rice pilaf', 'starch', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Mashed Potatoes', 'Creamy mashed potatoes', 'starch', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['milk'], true),
('Baked Potato', 'Baked potato with toppings', 'starch', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Oven Baked Fries', 'Crispy oven-baked fries', 'starch', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[], true);

-- ============================================
-- BEVERAGES
-- ============================================
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available) VALUES
('Water', 'Bottled water', 'beverage', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Coffee', 'Fresh brewed coffee', 'beverage', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Decaf Coffee', 'Decaffeinated coffee', 'beverage', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Hot Tea', 'Hot tea', 'beverage', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Decaf Hot Tea', 'Decaffeinated hot tea', 'beverage', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Milk 2%', '2% reduced fat milk', 'beverage', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian']::diet_type[], ARRAY['milk'], true),
('Apple Juice', 'Apple juice', 'beverage', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Cranberry Juice', 'Cranberry juice', 'beverage', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Orange Juice', 'Fresh orange juice', 'beverage', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true);

-- ============================================
-- BEVERAGE ADD-ONS (for coffee/tea)
-- ============================================
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available) VALUES
('Sugar', 'Sugar packet', 'beverage_addon', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Sweetener', 'Sugar-free sweetener', 'beverage_addon', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Non-Dairy Creamer', 'Non-dairy creamer', 'beverage_addon', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true);

-- ============================================
-- CONDIMENTS
-- ============================================
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available) VALUES
('Margarine', 'Butter alternative', 'condiment', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['milk'], true),
('Ketchup', 'Tomato ketchup', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[], true),
('Mustard', 'Yellow mustard', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Mayo', 'Mayonnaise', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'carb_controlled', 'vegetarian']::diet_type[], ARRAY['eggs'], true),
('BBQ Sauce', 'Barbecue sauce', 'condiment', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[], true),
('Picante Sauce', 'Mild picante sauce', 'condiment', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[], true);

-- ============================================
-- SALAD DRESSINGS
-- ============================================
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available) VALUES
('Ranch Dressing', 'Creamy ranch dressing', 'dressing', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['milk', 'eggs'], true),
('Italian Dressing', 'Italian vinaigrette', 'dressing', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Raspberry Vinaigrette', 'Sweet raspberry vinaigrette', 'dressing', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true);

-- ============================================
-- SALAD ADD-ONS
-- ============================================
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available) VALUES
('Crackers', 'Saltine crackers', 'salad_addon', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'vegetarian']::diet_type[], ARRAY['wheat'], true);

-- ============================================
-- DESSERTS
-- ============================================
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, is_available) VALUES
('Fresh Fruit Cup', 'Seasonal fresh fruit', 'dessert', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Chocolate Pudding', 'Creamy chocolate pudding', 'dessert', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['milk'], true),
('Vanilla Ice Cream', 'Classic vanilla ice cream', 'dessert', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['milk'], true),
('Sugar-Free Gelatin', 'Sugar-free gelatin dessert', 'dessert', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[], true),
('Cookie', 'Fresh baked cookie', 'dessert', ARRAY['lunch', 'dinner']::meal_type[], ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['wheat', 'eggs', 'milk'], true);
