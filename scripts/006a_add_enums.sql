-- Add missing enum values for item_category
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'vegetable';
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'starch';
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'dressing';
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'salad_addon';
