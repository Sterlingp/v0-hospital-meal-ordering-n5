-- COMPLETE MENU REBUILD - CORRECT ITEMS ONLY
-- Items with options use the ENTREE_OPTIONS system in types.ts

-- Clear everything
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM menu_items;

-- =====================
-- BREAKFAST ENTREES
-- =====================
-- Eggs - uses options for Regular/Lo-Chol AND Scrambled/Fried/Hard Boiled
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Eggs', 'entree', '{breakfast}', true);

-- Pancakes - uses options for Regular Syrup/Sugar-Free Syrup
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Pancakes', 'entree', '{breakfast}', true);

-- Breakfast Taco - uses options for protein and extras
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Breakfast Taco', 'entree', '{breakfast}', true);

-- These don't need options
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Breakfast Sandwich', 'entree', '{breakfast}', true),
('Ham & Cheese Omelet', 'entree', '{breakfast}', true);

-- =====================
-- LUNCH/DINNER ENTREES
-- =====================
-- Items WITH options (handled by ENTREE_OPTIONS in types.ts)
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Quesadilla', 'entree', '{lunch,dinner}', true),
('Classic Burger', 'entree', '{lunch,dinner}', true),
('Deli Sandwich', 'entree', '{lunch,dinner}', true),
('Garden Salad', 'entree', '{lunch,dinner}', true);

-- Items WITHOUT options
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Ribeye Steak', 'entree', '{lunch,dinner}', true),
('Hamburger Chuck Steak', 'entree', '{lunch,dinner}', true),
('Salmon Filet', 'entree', '{lunch,dinner}', true),
('Grilled Chicken Breast', 'entree', '{lunch,dinner}', true),
('Chicken Tenders', 'entree', '{lunch,dinner}', true),
('Grilled Cheese Sandwich', 'entree', '{lunch,dinner}', true),
('Macaroni & Cheese', 'entree', '{lunch,dinner}', true);

-- =====================
-- SOUPS (side option with entree)
-- =====================
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Chicken Noodle Soup', 'soup', '{lunch,dinner}', true),
('Tomato Soup', 'soup', '{lunch,dinner}', true),
('Vegetable Broth', 'soup', '{lunch,dinner}', true);

-- =====================
-- BREAKFAST SIDES
-- =====================
-- Bread items - use options for spreads (Margarine/Jelly/SF Jelly)
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Wheat Toast', 'side', '{breakfast}', true),
('Blueberry Muffin', 'side', '{breakfast}', true),
('Flour Tortilla', 'side', '{breakfast}', true);

-- Fruit & Dairy - no options needed
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Fresh Berries', 'side', '{breakfast}', true),
('Grapes', 'side', '{breakfast}', true),
('Cottage Cheese', 'side', '{breakfast}', true),
('Yogurt', 'side', '{breakfast}', true);

-- =====================
-- LUNCH/DINNER SIDES - VEGETABLES
-- =====================
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Broccoli', 'vegetable', '{lunch,dinner}', true),
('Carrots', 'vegetable', '{lunch,dinner}', true),
('Green Beans', 'vegetable', '{lunch,dinner}', true);

-- =====================
-- LUNCH/DINNER SIDES - STARCHES
-- =====================
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Mashed Potatoes', 'starch', '{lunch,dinner}', true),
('Rice Pilaf', 'starch', '{lunch,dinner}', true),
('Brown Rice', 'starch', '{lunch,dinner}', true),
('Oven Baked Fries', 'starch', '{lunch,dinner}', true),
('Baked Chips', 'starch', '{lunch,dinner}', true);

-- =====================
-- BEVERAGES
-- =====================
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Coffee', 'beverage', '{breakfast,lunch,dinner}', true),
('Decaf Coffee', 'beverage', '{breakfast,lunch,dinner}', true),
('HOT Tea', 'beverage', '{breakfast,lunch,dinner}', true),
('Decaf HOT Tea', 'beverage', '{breakfast,lunch,dinner}', true),
('Milk 2%', 'beverage', '{breakfast,lunch,dinner}', true),
('Apple Juice', 'beverage', '{breakfast}', true),
('Cranberry Juice', 'beverage', '{breakfast}', true),
('Orange Juice', 'beverage', '{breakfast}', true),
('Iced Tea', 'beverage', '{lunch,dinner}', true),
('Decaf Iced Tea', 'beverage', '{lunch,dinner}', true);

-- =====================
-- BEVERAGE ADD-ONS (for Coffee/Tea)
-- =====================
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Sugar', 'beverage_addon', '{breakfast,lunch,dinner}', true),
('Sweetener', 'beverage_addon', '{breakfast,lunch,dinner}', true),
('Non-Dairy Creamer', 'beverage_addon', '{breakfast,lunch,dinner}', true);

-- =====================
-- SALAD DRESSINGS
-- =====================
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Ranch Dressing', 'dressing', '{lunch,dinner}', true),
('Italian Dressing', 'dressing', '{lunch,dinner}', true),
('Raspberry Vinaigrette', 'dressing', '{lunch,dinner}', true);

-- =====================
-- CONDIMENTS (sauces for food)
-- =====================
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Margarine', 'condiment', '{breakfast,lunch,dinner}', true),
('Ketchup', 'condiment', '{lunch,dinner}', true),
('Mustard', 'condiment', '{lunch,dinner}', true),
('Mayo', 'condiment', '{lunch,dinner}', true),
('BBQ Sauce', 'condiment', '{lunch,dinner}', true),
('Picante Sauce', 'condiment', '{breakfast,lunch,dinner}', true),
('Crackers', 'condiment', '{lunch,dinner}', true);

-- =====================
-- SEASONINGS (salt, pepper, etc)
-- =====================
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Salt', 'seasoning', '{lunch,dinner}', true),
('Pepper', 'seasoning', '{breakfast,lunch,dinner}', true),
('Dash Seasoning', 'seasoning', '{breakfast,lunch,dinner}', true);

-- =====================
-- DESSERTS
-- =====================
INSERT INTO menu_items (name, category, meal_types, available) VALUES
('Ice Cream', 'dessert', '{lunch,dinner}', true),
('Pudding', 'dessert', '{lunch,dinner}', true),
('Sugar-Free Pudding', 'dessert', '{lunch,dinner}', true),
('Gelatin', 'dessert', '{lunch,dinner}', true),
('Sugar-Free Gelatin', 'dessert', '{lunch,dinner}', true),
('Fruit Cocktail', 'dessert', '{lunch,dinner}', true);
