-- Add new item categories for condiments and seasonings
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'condiment';
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'seasoning';
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'soup';
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'salad';
