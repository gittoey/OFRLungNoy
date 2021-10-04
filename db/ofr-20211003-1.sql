/*
 Navicat Premium Data Transfer

 Source Server         : phpMyAdmin
 Source Server Type    : MySQL
 Source Server Version : 80017
 Source Host           : localhost:3306
 Source Schema         : ofr

 Target Server Type    : MySQL
 Target Server Version : 80017
 File Encoding         : 65001

 Date: 03/10/2021 20:28:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for oder
-- ----------------------------
DROP TABLE IF EXISTS `oder`;
CREATE TABLE `oder`  (
  `OderID` int(11) NOT NULL AUTO_INCREMENT,
  `OderNo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `UserID` int(20) NOT NULL,
  `AddressText` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `ProvinceID` int(11) NULL DEFAULT NULL,
  `DistrictID` int(11) NULL DEFAULT NULL,
  `SubdistrictID` int(11) NULL DEFAULT NULL,
  `Remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `StatusCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PendingPayment',
  `CreateBy` int(11) NOT NULL,
  `UpdateBy` int(11) NOT NULL,
  `CreateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `UpdateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `Active` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`OderID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for oderdetail
-- ----------------------------
DROP TABLE IF EXISTS `oderdetail`;
CREATE TABLE `oderdetail`  (
  `OderDetailID` int(11) NOT NULL AUTO_INCREMENT,
  `OderID` int(11) NOT NULL,
  `VarietiesID` int(11) NOT NULL,
  `GradeCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `SellingPrice` decimal(18, 2) NOT NULL,
  `Amount` int(11) NOT NULL,
  `CreateBy` int(11) NOT NULL,
  `UpdateBy` int(11) NOT NULL,
  `CreateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `UpdateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `Active` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`OderDetailID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;


CREATE DEFINER=`root`@`localhost` FUNCTION `genoderno`() RETURNS varchar(14) CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci
    READS SQL DATA
BEGIN
      DECLARE vOderNo VARCHAR(14);
			DECLARE vMonth VARCHAR(2);
			DECLARE iNo INTEGER;
			
			SELECT
				oder.OderNo
			INTO
				vOderNo
			FROM
				oder
			ORDER BY
				oder.OderNo DESC
			LIMIT 1;
			
			IF MONTH(NOW()) < 10 THEN
				SET vMonth = CONCAT('0',MONTH(NOW()));
			ELSE
				SET vMonth = CONCAT(MONTH(NOW()));
			END IF;
			
			IF vOderNo IS NULL THEN
				RETURN CONCAT('O-',YEAR(NOW()),'M',vMonth,'00001');
			END IF;
			
			SET iNo = CONVERT(SUBSTRING(vOderNo, -5), SIGNED INTEGER) + 1;
						
      RETURN CONCAT('O-',YEAR(NOW()),'M',vMonth, SUBSTRING(CONCAT('0000',iNo),-5));
    END;

-- ----------------------------
-- Triggers structure for table oder
-- ----------------------------
DROP TRIGGER IF EXISTS `before_insert_oder_oderno`;
delimiter ;;
CREATE TRIGGER `before_insert_oder_oderno` BEFORE INSERT ON `oder` FOR EACH ROW SET new.OderNo = `genoderno`()
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
