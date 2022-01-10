ALTER TABLE `ofr`.`price` 
ADD COLUMN `Stock` int NOT NULL DEFAULT 0 AFTER `SellingPrice`;