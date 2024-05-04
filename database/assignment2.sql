-- Query 2
INSERT INTO public.account 
	(account_id, account_firstname, account_lastname, account_email, account_password)
VALUES
	(1, 'Tony', 'Stark', 'tony@starknet.com', 'Iam1ronM@n');

-- Query 2
INSERT INTO public.account 
UPDATE 
    public.account
SET 
    account_type = 'Admin'::account_type
WHERE 
    account_id = 1;

-- Query 3
INSERT INTO public.account 
DELETE FROM 
    public.account
WHERE 
    account_id = 2;

-- Query 4
INSERT INTO public.account 
UPDATE 
    inventory
SET 
    inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE 
    inv_make = 'GM';

-- Query 5
INSERT INTO public.account 
SELECT inv_make, inv_model, classification_name
FROM inventory
    JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification_name like '%Sport%';

-- Query 6
INSERT INTO public.account 
UPDATE 
    inventory
SET 
    inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/'),
    inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/');

-- View Database changes --
SELECT * from inventory;