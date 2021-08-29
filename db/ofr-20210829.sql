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

 Date: 29/08/2021 19:30:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for price
-- ----------------------------
DROP TABLE IF EXISTS `price`;
CREATE TABLE `price`  (
  `PriceID` int(11) NOT NULL AUTO_INCREMENT,
  `VarietiesID` int(11) NOT NULL,
  `GradeCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `CostPrice` double(18, 2) NOT NULL,
  `SellingPrice` decimal(18, 2) NOT NULL,
  `CreateBy` int(11) NOT NULL,
  `UpdateBy` int(11) NOT NULL,
  `CreateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `UpdateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `Active` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`PriceID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for systemconfig
-- ----------------------------
DROP TABLE IF EXISTS `systemconfig`;
CREATE TABLE `systemconfig`  (
  `SystemConfigID` int(11) NOT NULL AUTO_INCREMENT,
  `ConfigCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ConfigValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ConfigDisplay` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreateBy` int(11) NOT NULL,
  `UpdateBy` int(11) NOT NULL,
  `CreateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `UpdateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `Active` bit(1) NULL DEFAULT b'1',
  PRIMARY KEY (`SystemConfigID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
