-- Fix breakfast menu items

-- Remove grits
DELETE FROM menu_items WHERE LOWER(name) LIKE '%grits%';

-- Remove any duplicate breakfast items
DELETE FROM menu_items a USING menu_items b 
WHERE a.id > b.id AND LOWER(a.name) = LOWER(b.name);

-- Update Breakfast Taco to be base entree (options will be handled in UI)
UPDATE menu_items SET description = 'Choose your toppings' WHERE LOWER(name) = 'breakfast taco';

-- Ensure we have proper breakfast taco add-ons as a separate category
-- First add the entree_addon category if not exists
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'entree_addon';
