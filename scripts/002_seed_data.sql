-- Seed data for Hospital Meal Ordering System

-- Insert test patients
INSERT INTO patients (room_number, bed_label, first_name, last_name, diet_type, allergies, special_instructions) VALUES
('101', 'A', 'John', 'Smith', 'regular', '{}', NULL),
('101', 'B', 'Mary', 'Johnson', 'heart_healthy', '{peanuts}', 'Prefers warm meals'),
('102', 'A', 'Robert', 'Williams', 'renal', '{shellfish, dairy}', 'Low potassium'),
('102', 'B', 'Patricia', 'Brown', 'carb_controlled', '{}', 'Diabetic - monitor carbs'),
('103', 'A', 'Michael', 'Davis', 'vegetarian', '{eggs}', NULL),
('103', 'B', 'Linda', 'Miller', 'no_added_salt', '{}', 'Cardiac patient'),
('104', 'A', 'James', 'Wilson', 'regular', '{gluten}', 'Celiac disease'),
('104', 'B', 'Barbara', 'Moore', 'heart_healthy', '{}', NULL);

-- Insert breakfast items
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, calories, protein_g, carbs_g, fat_g, sodium_mg) VALUES
-- Breakfast Entrees
('Scrambled Eggs', 'Fluffy scrambled eggs made with butter', 'entree', '{breakfast}', '{regular, heart_healthy, carb_controlled, vegetarian, no_added_salt}', '{eggs, dairy}', 220, 14.0, 2.0, 17.0, 180),
('Oatmeal', 'Steel-cut oatmeal with brown sugar', 'entree', '{breakfast}', '{regular, heart_healthy, renal, carb_controlled, vegetarian, no_added_salt}', '{}', 150, 5.0, 27.0, 3.0, 10),
('Pancakes', 'Buttermilk pancakes with maple syrup', 'entree', '{breakfast}', '{regular, vegetarian}', '{gluten, eggs, dairy}', 350, 8.0, 58.0, 10.0, 450),
('Egg White Omelet', 'Egg whites with spinach and tomatoes', 'entree', '{breakfast}', '{regular, heart_healthy, carb_controlled, vegetarian, no_added_salt}', '{eggs}', 120, 18.0, 4.0, 2.0, 150),
('French Toast', 'Cinnamon French toast with powdered sugar', 'entree', '{breakfast}', '{regular, vegetarian}', '{gluten, eggs, dairy}', 380, 10.0, 52.0, 14.0, 380),

-- Breakfast Sides
('Turkey Bacon', 'Crispy turkey bacon strips', 'side', '{breakfast}', '{regular, heart_healthy, carb_controlled}', '{}', 90, 6.0, 1.0, 7.0, 320),
('Fresh Fruit Cup', 'Seasonal mixed fruit', 'side', '{breakfast}', '{regular, heart_healthy, renal, vegetarian, no_added_salt}', '{}', 60, 1.0, 15.0, 0.0, 5),
('Hash Browns', 'Crispy golden hash browns', 'side', '{breakfast}', '{regular, vegetarian}', '{}', 180, 2.0, 22.0, 9.0, 280),
('Whole Wheat Toast', 'Toasted whole wheat bread', 'side', '{breakfast}', '{regular, heart_healthy, vegetarian, no_added_salt}', '{gluten}', 80, 3.0, 14.0, 1.0, 120),
('Yogurt Parfait', 'Low-fat yogurt with granola', 'side', '{breakfast}', '{regular, vegetarian}', '{dairy, gluten}', 180, 6.0, 32.0, 3.0, 90),

-- Breakfast Beverages
('Orange Juice', 'Fresh squeezed orange juice', 'beverage', '{breakfast}', '{regular, heart_healthy, vegetarian, no_added_salt}', '{}', 110, 2.0, 26.0, 0.0, 0),
('Coffee', 'Regular brewed coffee', 'beverage', '{breakfast}', '{regular, heart_healthy, carb_controlled, vegetarian, no_added_salt}', '{}', 5, 0.0, 0.0, 0.0, 5),
('Hot Tea', 'Assorted hot tea selection', 'beverage', '{breakfast}', '{regular, heart_healthy, renal, carb_controlled, vegetarian, no_added_salt}', '{}', 0, 0.0, 0.0, 0.0, 0),
('Milk', '2% reduced fat milk', 'beverage', '{breakfast, lunch, dinner}', '{regular, vegetarian}', '{dairy}', 120, 8.0, 12.0, 5.0, 100);

-- Insert lunch items
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, calories, protein_g, carbs_g, fat_g, sodium_mg) VALUES
-- Lunch Entrees
('Grilled Chicken Breast', 'Herb-seasoned grilled chicken breast', 'entree', '{lunch, dinner}', '{regular, heart_healthy, carb_controlled, no_added_salt}', '{}', 280, 42.0, 0.0, 12.0, 180),
('Turkey Sandwich', 'Sliced turkey on whole wheat with lettuce and tomato', 'entree', '{lunch}', '{regular, heart_healthy}', '{gluten}', 320, 24.0, 32.0, 10.0, 580),
('Garden Salad with Grilled Chicken', 'Mixed greens with grilled chicken and vinaigrette', 'entree', '{lunch}', '{regular, heart_healthy, carb_controlled, no_added_salt}', '{}', 260, 28.0, 12.0, 12.0, 220),
('Vegetable Soup', 'Hearty vegetable soup with herbs', 'entree', '{lunch}', '{regular, heart_healthy, vegetarian, no_added_salt}', '{}', 120, 4.0, 18.0, 3.0, 180),
('Tuna Salad Plate', 'Light tuna salad on bed of greens', 'entree', '{lunch}', '{regular, heart_healthy, carb_controlled}', '{fish}', 240, 22.0, 8.0, 14.0, 380),
('Veggie Wrap', 'Grilled vegetables in a whole wheat wrap', 'entree', '{lunch}', '{regular, heart_healthy, vegetarian}', '{gluten}', 290, 10.0, 42.0, 10.0, 420),

-- Lunch Sides
('Steamed Broccoli', 'Fresh steamed broccoli florets', 'side', '{lunch, dinner}', '{regular, heart_healthy, renal, carb_controlled, vegetarian, no_added_salt}', '{}', 55, 4.0, 10.0, 0.5, 30),
('Brown Rice', 'Fluffy steamed brown rice', 'side', '{lunch, dinner}', '{regular, heart_healthy, vegetarian, no_added_salt}', '{}', 160, 4.0, 34.0, 1.5, 10),
('Side Salad', 'Mixed greens with choice of dressing', 'side', '{lunch, dinner}', '{regular, heart_healthy, carb_controlled, vegetarian, no_added_salt}', '{}', 45, 2.0, 8.0, 0.5, 25),
('Cottage Cheese', 'Low-fat cottage cheese', 'side', '{lunch}', '{regular, carb_controlled, vegetarian}', '{dairy}', 90, 12.0, 6.0, 2.0, 280),
('Fresh Fruit', 'Seasonal sliced fruit', 'side', '{lunch, dinner}', '{regular, heart_healthy, vegetarian, no_added_salt}', '{}', 60, 1.0, 15.0, 0.0, 5),

-- Lunch Desserts
('Sugar-Free Gelatin', 'Sugar-free flavored gelatin', 'dessert', '{lunch, dinner}', '{regular, heart_healthy, carb_controlled, vegetarian, no_added_salt}', '{}', 10, 1.0, 0.0, 0.0, 40),
('Fresh Berries', 'Mixed seasonal berries', 'dessert', '{lunch, dinner}', '{regular, heart_healthy, carb_controlled, vegetarian, no_added_salt}', '{}', 50, 1.0, 12.0, 0.5, 1),
('Vanilla Pudding', 'Creamy vanilla pudding', 'dessert', '{lunch, dinner}', '{regular, vegetarian}', '{dairy}', 140, 3.0, 24.0, 4.0, 150);

-- Insert dinner items
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, calories, protein_g, carbs_g, fat_g, sodium_mg) VALUES
-- Dinner Entrees
('Baked Salmon', 'Oven-baked salmon with lemon dill sauce', 'entree', '{dinner}', '{regular, heart_healthy, carb_controlled, no_added_salt}', '{fish}', 320, 36.0, 2.0, 18.0, 200),
('Roasted Turkey', 'Oven-roasted turkey breast with gravy', 'entree', '{dinner}', '{regular, heart_healthy}', '{}', 280, 38.0, 8.0, 10.0, 420),
('Beef Tenderloin', 'Grilled beef tenderloin with herb butter', 'entree', '{dinner}', '{regular, carb_controlled}', '{dairy}', 380, 42.0, 0.0, 22.0, 280),
('Vegetable Stir Fry', 'Mixed vegetables in light sauce over rice', 'entree', '{dinner}', '{regular, heart_healthy, vegetarian, no_added_salt}', '{soy}', 260, 8.0, 38.0, 8.0, 320),
('Baked Cod', 'Herb-crusted baked cod fillet', 'entree', '{dinner}', '{regular, heart_healthy, carb_controlled, no_added_salt}', '{fish, gluten}', 220, 32.0, 6.0, 6.0, 180),
('Pasta Primavera', 'Whole wheat pasta with seasonal vegetables', 'entree', '{dinner}', '{regular, vegetarian}', '{gluten}', 340, 12.0, 52.0, 10.0, 380),

-- Dinner Sides
('Mashed Potatoes', 'Creamy mashed potatoes', 'side', '{dinner}', '{regular, vegetarian}', '{dairy}', 180, 3.0, 28.0, 7.0, 380),
('Green Beans Almondine', 'Sauteed green beans with almonds', 'side', '{dinner}', '{regular, heart_healthy, carb_controlled, vegetarian, no_added_salt}', '{tree nuts}', 80, 3.0, 10.0, 4.0, 45),
('Roasted Vegetables', 'Seasonal roasted root vegetables', 'side', '{dinner}', '{regular, heart_healthy, vegetarian, no_added_salt}', '{}', 100, 2.0, 18.0, 3.0, 60),
('Baked Potato', 'Baked russet potato with butter', 'side', '{dinner}', '{regular, vegetarian}', '{dairy}', 220, 5.0, 42.0, 5.0, 25),

-- Dinner Desserts
('Chocolate Cake', 'Rich chocolate layer cake', 'dessert', '{dinner}', '{regular, vegetarian}', '{gluten, eggs, dairy}', 380, 5.0, 52.0, 18.0, 340),
('Apple Crisp', 'Warm apple crisp with oat topping', 'dessert', '{dinner}', '{regular, vegetarian}', '{gluten}', 280, 3.0, 48.0, 10.0, 120),
('Ice Cream', 'Vanilla ice cream', 'dessert', '{dinner}', '{regular, vegetarian}', '{dairy}', 200, 4.0, 24.0, 10.0, 80),
('Fruit Sorbet', 'Dairy-free fruit sorbet', 'dessert', '{dinner}', '{regular, heart_healthy, vegetarian, no_added_salt}', '{}', 120, 0.0, 30.0, 0.0, 10);

-- Beverages for all meals
INSERT INTO menu_items (name, description, category, meal_types, allowed_diets, allergens, calories, protein_g, carbs_g, fat_g, sodium_mg) VALUES
('Water', 'Bottled water', 'beverage', '{breakfast, lunch, dinner}', '{regular, heart_healthy, renal, carb_controlled, vegetarian, no_added_salt}', '{}', 0, 0.0, 0.0, 0.0, 0),
('Apple Juice', 'Fresh apple juice', 'beverage', '{lunch, dinner}', '{regular, heart_healthy, vegetarian, no_added_salt}', '{}', 120, 0.0, 28.0, 0.0, 10),
('Iced Tea', 'Unsweetened iced tea', 'beverage', '{lunch, dinner}', '{regular, heart_healthy, carb_controlled, vegetarian, no_added_salt}', '{}', 0, 0.0, 0.0, 0.0, 0),
('Cranberry Juice', 'Cranberry juice cocktail', 'beverage', '{lunch, dinner}', '{regular, vegetarian}', '{}', 140, 0.0, 34.0, 0.0, 5),
('Ginger Ale', 'Caffeine-free ginger ale', 'beverage', '{lunch, dinner}', '{regular, vegetarian}', '{}', 120, 0.0, 32.0, 0.0, 35);
