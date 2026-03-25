-- Clean up duplicate menu items and fix categories

-- First, delete ALL menu items and recreate properly to avoid duplicates
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM menu_items;

-- ============================================
-- BREAKFAST ENTREES
-- ============================================
INSERT INTO menu_items (name, description, meal_types, category, is_available, allowed_diets, allergens) VALUES
('Scrambled Eggs', 'Fluffy scrambled eggs', ARRAY['breakfast']::meal_type[], 'entree', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['eggs']),
('Fried Eggs', 'Two eggs cooked to order', ARRAY['breakfast']::meal_type[], 'entree', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['eggs']),
('Hard Boiled Eggs', 'Two hard boiled eggs', ARRAY['breakfast']::meal_type[], 'entree', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['eggs']),
('Lo-Chol Scrambled Eggs', 'Cholesterol-free egg substitute', ARRAY['breakfast']::meal_type[], 'entree', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Pancakes', 'Fluffy buttermilk pancakes', ARRAY['breakfast']::meal_type[], 'entree', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['wheat', 'dairy', 'eggs']),
('Breakfast Sandwich', 'Fried egg, sausage patty, American cheese on toasted wheat bread', ARRAY['breakfast']::meal_type[], 'entree', true, ARRAY['regular']::diet_type[], ARRAY['wheat', 'dairy', 'eggs']),
('Ham & Cheese Omelet', 'Three-egg omelet with diced ham and melted cheese', ARRAY['breakfast']::meal_type[], 'entree', true, ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY['eggs', 'dairy']),
('Breakfast Taco', 'Flour tortilla with eggs and your choice of meat', ARRAY['breakfast']::meal_type[], 'entree', true, ARRAY['regular']::diet_type[], ARRAY['wheat', 'eggs']),

-- ============================================
-- BREAKFAST MEAT SIDES (for Breakfast Taco options)
-- ============================================
('Pork Sausage', 'Seasoned breakfast sausage patty', ARRAY['breakfast']::meal_type[], 'side', true, ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY[]::text[]),
('Turkey Sausage', 'Lean turkey sausage patty', ARRAY['breakfast']::meal_type[], 'side', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Ham', 'Sliced breakfast ham', ARRAY['breakfast']::meal_type[], 'side', true, ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY[]::text[]),
('Bacon', 'Crispy strips of bacon', ARRAY['breakfast']::meal_type[], 'side', true, ARRAY['regular', 'carb_controlled']::diet_type[], ARRAY[]::text[]),
('Turkey Bacon', 'Lean turkey bacon strips', ARRAY['breakfast']::meal_type[], 'side', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[]),

-- ============================================
-- BREAKFAST BREADS/STARCHES
-- ============================================
('Wheat Toast', 'Two slices of toasted wheat bread', ARRAY['breakfast']::meal_type[], 'starch', true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['wheat']),
('Blueberry Muffin', 'Fresh baked blueberry muffin', ARRAY['breakfast']::meal_type[], 'starch', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['wheat', 'dairy', 'eggs']),
('Flour Tortilla', 'Warm flour tortilla', ARRAY['breakfast']::meal_type[], 'starch', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['wheat']),
('Grits', 'Creamy Southern-style grits', ARRAY['breakfast']::meal_type[], 'starch', true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Oatmeal', 'Hearty oatmeal', ARRAY['breakfast']::meal_type[], 'starch', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),

-- ============================================
-- BREAKFAST FRUITS
-- ============================================
('Fresh Berries', 'Seasonal mixed berries', ARRAY['breakfast']::meal_type[], 'side', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Grapes', 'Fresh seedless grapes', ARRAY['breakfast']::meal_type[], 'side', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Cottage Cheese', 'Creamy cottage cheese', ARRAY['breakfast']::meal_type[], 'side', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian']::diet_type[], ARRAY['dairy']),
('Yogurt', 'Low-fat vanilla yogurt', ARRAY['breakfast']::meal_type[], 'side', true, ARRAY['regular', 'heart_healthy', 'vegetarian']::diet_type[], ARRAY['dairy']),

-- ============================================
-- LUNCH/DINNER ENTREES
-- ============================================
('Grilled Chicken Breast', 'Seasoned grilled chicken breast', ARRAY['lunch', 'dinner']::meal_type[], 'entree', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Baked Salmon', 'Oven-baked Atlantic salmon fillet', ARRAY['lunch', 'dinner']::meal_type[], 'entree', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['fish']),
('Classic Burger', 'Beef patty on a toasted bun with lettuce and tomato', ARRAY['lunch', 'dinner']::meal_type[], 'entree', true, ARRAY['regular']::diet_type[], ARRAY['wheat']),
('Turkey Burger', 'Lean turkey patty on a toasted bun', ARRAY['lunch', 'dinner']::meal_type[], 'entree', true, ARRAY['regular', 'heart_healthy']::diet_type[], ARRAY['wheat']),
('Deli Sandwich', 'Your choice of meat on fresh bread with lettuce and tomato', ARRAY['lunch', 'dinner']::meal_type[], 'entree', true, ARRAY['regular', 'heart_healthy']::diet_type[], ARRAY['wheat']),
('Chicken Quesadilla', 'Grilled flour tortilla with chicken and melted cheese', ARRAY['lunch', 'dinner']::meal_type[], 'entree', true, ARRAY['regular']::diet_type[], ARRAY['wheat', 'dairy']),
('Vegetable Quesadilla', 'Grilled flour tortilla with mixed vegetables and cheese', ARRAY['lunch', 'dinner']::meal_type[], 'entree', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['wheat', 'dairy']),
('Garden Salad', 'Fresh mixed greens with tomatoes and cucumbers', ARRAY['lunch', 'dinner']::meal_type[], 'entree', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Pasta Marinara', 'Penne pasta with marinara sauce', ARRAY['lunch', 'dinner']::meal_type[], 'entree', true, ARRAY['regular', 'vegetarian', 'heart_healthy']::diet_type[], ARRAY['wheat']),
('Meatloaf', 'Traditional homestyle meatloaf', ARRAY['lunch', 'dinner']::meal_type[], 'entree', true, ARRAY['regular']::diet_type[], ARRAY['wheat', 'eggs']),
('Baked Fish', 'Lightly seasoned baked white fish', ARRAY['lunch', 'dinner']::meal_type[], 'entree', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['fish']),

-- ============================================
-- SOUPS
-- ============================================
('Chicken Noodle Soup', 'Classic chicken noodle soup', ARRAY['lunch', 'dinner']::meal_type[], 'soup', true, ARRAY['regular', 'heart_healthy']::diet_type[], ARRAY['wheat']),
('Tomato Soup', 'Creamy tomato bisque', ARRAY['lunch', 'dinner']::meal_type[], 'soup', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['dairy']),
('Vegetable Soup', 'Hearty vegetable soup', ARRAY['lunch', 'dinner']::meal_type[], 'soup', true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),

-- ============================================
-- SALADS (as side option)
-- ============================================
('Side Garden Salad', 'Small garden salad with mixed greens', ARRAY['lunch', 'dinner']::meal_type[], 'salad', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),

-- ============================================
-- VEGETABLES
-- ============================================
('Steamed Broccoli', 'Fresh steamed broccoli florets', ARRAY['lunch', 'dinner']::meal_type[], 'vegetable', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Green Beans', 'Tender green beans', ARRAY['lunch', 'dinner']::meal_type[], 'vegetable', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Glazed Carrots', 'Sweet glazed carrots', ARRAY['lunch', 'dinner']::meal_type[], 'vegetable', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[]),
('Mixed Vegetables', 'Seasonal steamed vegetables', ARRAY['lunch', 'dinner']::meal_type[], 'vegetable', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),

-- ============================================
-- STARCHES (Lunch/Dinner)
-- ============================================
('Mashed Potatoes', 'Creamy mashed potatoes', ARRAY['lunch', 'dinner']::meal_type[], 'starch', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['dairy']),
('Rice Pilaf', 'Seasoned rice pilaf', ARRAY['lunch', 'dinner']::meal_type[], 'starch', true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Oven Baked Fries', 'Crispy oven-baked potato fries', ARRAY['lunch', 'dinner']::meal_type[], 'starch', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[]),
('Baked Potato', 'Fluffy baked potato', ARRAY['lunch', 'dinner']::meal_type[], 'starch', true, ARRAY['regular', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),

-- ============================================
-- DRESSINGS
-- ============================================
('Ranch Dressing', 'Creamy ranch dressing', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'dressing', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['dairy', 'eggs']),
('Italian Dressing', 'Classic Italian vinaigrette', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'dressing', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Raspberry Vinaigrette', 'Sweet raspberry vinaigrette', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'dressing', true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),

-- ============================================
-- SALAD ADD-ONS (protein for standalone salad)
-- ============================================
('Grilled Chicken', 'Sliced grilled chicken breast for salad', ARRAY['lunch', 'dinner']::meal_type[], 'salad_addon', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Grilled Salmon', 'Grilled salmon fillet for salad', ARRAY['lunch', 'dinner']::meal_type[], 'salad_addon', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'no_added_salt']::diet_type[], ARRAY['fish']),
('Crackers', 'Saltine crackers', ARRAY['lunch', 'dinner']::meal_type[], 'salad_addon', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['wheat']),

-- ============================================
-- CONDIMENTS
-- ============================================
('Margarine', 'Individual margarine pat', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'condiment', true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['dairy']),
('Jelly', 'Grape jelly packet', ARRAY['breakfast']::meal_type[], 'condiment', true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Sugar-Free Jelly', 'Sugar-free grape jelly', ARRAY['breakfast']::meal_type[], 'condiment', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Syrup', 'Maple-flavored syrup', ARRAY['breakfast']::meal_type[], 'condiment', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[]),
('Sugar-Free Syrup', 'Sugar-free maple-flavored syrup', ARRAY['breakfast']::meal_type[], 'condiment', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Mustard', 'Yellow mustard packet', ARRAY['lunch', 'dinner']::meal_type[], 'condiment', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Mayonnaise', 'Mayonnaise packet', ARRAY['lunch', 'dinner']::meal_type[], 'condiment', true, ARRAY['regular', 'carb_controlled', 'vegetarian']::diet_type[], ARRAY['eggs']),
('Ketchup', 'Ketchup packet', ARRAY['lunch', 'dinner']::meal_type[], 'condiment', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[]),
('BBQ Sauce', 'Tangy BBQ sauce', ARRAY['lunch', 'dinner']::meal_type[], 'condiment', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY[]::text[]),
('Picante Sauce', 'Mild picante sauce', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'condiment', true, ARRAY['regular', 'heart_healthy', 'vegetarian']::diet_type[], ARRAY[]::text[]),
('Cheese Slice', 'American cheese slice', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'condiment', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['dairy']),

-- ============================================
-- BEVERAGES
-- ============================================
('Coffee', 'Hot brewed coffee', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'beverage', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Decaf Coffee', 'Decaffeinated hot coffee', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'beverage', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Hot Tea', 'Hot brewed tea', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'beverage', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Decaf Hot Tea', 'Decaffeinated hot tea', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'beverage', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Milk 2%', '2% reduced fat milk', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'beverage', true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['dairy']),
('Apple Juice', '100% apple juice', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'beverage', true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Cranberry Juice', 'Cranberry juice cocktail', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'beverage', true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Orange Juice', '100% orange juice', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'beverage', true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Water', 'Bottled water', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'beverage', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),

-- ============================================
-- BEVERAGE ADD-ONS (Coffee/Tea)
-- ============================================
('Sugar', 'Sugar packet', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'beverage_addon', true, ARRAY['regular', 'heart_healthy', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Sweetener', 'Sugar-free sweetener packet', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'beverage_addon', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Non-Dairy Creamer', 'Non-dairy creamer', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'beverage_addon', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),

-- ============================================
-- DESSERTS
-- ============================================
('Fresh Fruit Cup', 'Seasonal fresh fruit medley', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'dessert', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Sugar-Free Gelatin', 'Sugar-free flavored gelatin', ARRAY['breakfast', 'lunch', 'dinner']::meal_type[], 'dessert', true, ARRAY['regular', 'heart_healthy', 'renal', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY[]::text[]),
('Chocolate Cake', 'Rich chocolate layer cake', ARRAY['lunch', 'dinner']::meal_type[], 'dessert', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['wheat', 'dairy', 'eggs']),
('Vanilla Ice Cream', 'Creamy vanilla ice cream', ARRAY['lunch', 'dinner']::meal_type[], 'dessert', true, ARRAY['regular', 'vegetarian']::diet_type[], ARRAY['dairy']),
('Sugar-Free Pudding', 'Sugar-free vanilla pudding', ARRAY['lunch', 'dinner']::meal_type[], 'dessert', true, ARRAY['regular', 'heart_healthy', 'carb_controlled', 'vegetarian', 'no_added_salt']::diet_type[], ARRAY['dairy']);
