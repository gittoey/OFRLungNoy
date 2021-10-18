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

 Date: 18/10/2021 11:25:06
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order`  (
  `OrderID` int(11) NOT NULL AUTO_INCREMENT,
  `OrderNo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `UserID` int(20) NOT NULL,
  `AddressText` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `ProvinceID` int(11) NULL DEFAULT NULL,
  `DistrictID` int(11) NULL DEFAULT NULL,
  `SubDistrictID` int(11) NULL DEFAULT NULL,
  `Remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `StatusCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PendingPayment',
  `CreateBy` int(11) NOT NULL,
  `UpdateBy` int(11) NOT NULL,
  `CreateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `UpdateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `Active` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`OrderID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for orderdetail
-- ----------------------------
DROP TABLE IF EXISTS `orderdetail`;
CREATE TABLE `orderdetail`  (
  `OrderDetailID` int(11) NOT NULL AUTO_INCREMENT,
  `OrderID` int(11) NOT NULL,
  `VarietiesID` int(11) NOT NULL,
  `GradeCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `SellingPrice` decimal(18, 2) NOT NULL,
  `Amount` int(11) NOT NULL,
  `CreateBy` int(11) NOT NULL,
  `UpdateBy` int(11) NOT NULL,
  `CreateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `UpdateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `Active` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`OrderDetailID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for orderpayment
-- ----------------------------
DROP TABLE IF EXISTS `orderpayment`;
CREATE TABLE `orderpayment`  (
  `OrderPaymentID` int(11) NOT NULL AUTO_INCREMENT,
  `OrderID` int(11) NOT NULL,
  `PaymentDate` date NOT NULL,
  `PaymentImg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `CreateBy` int(11) NOT NULL,
  `UpdateBy` int(11) NOT NULL,
  `CreateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `UpdateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `Active` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`OrderPaymentID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Triggers structure for table order
-- ----------------------------
DROP TRIGGER IF EXISTS `before_insert_oder_oderno`;
delimiter ;;
CREATE TRIGGER `before_insert_oder_oderno` BEFORE INSERT ON `order` FOR EACH ROW SET new.OderNo = `genoderno`()
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
