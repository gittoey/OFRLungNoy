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

 Date: 04/10/2021 12:46:20
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for systemconfig
-- ----------------------------
DROP TABLE IF EXISTS `systemconfig`;
CREATE TABLE `systemconfig`  (
  `SystemConfigID` int(11) NOT NULL AUTO_INCREMENT,
  `ConfigCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `SeqID` int(11) NULL DEFAULT NULL,
  `ConfigValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ConfigDisplay` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreateBy` int(11) NOT NULL,
  `UpdateBy` int(11) NOT NULL,
  `CreateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `UpdateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `Active` bit(1) NULL DEFAULT b'1',
  PRIMARY KEY (`SystemConfigID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of systemconfig
-- ----------------------------
INSERT INTO `systemconfig` VALUES (1, 'Grade', 1, 'A', 'A', NULL, 0, 0, '2021-08-28 18:47:33', '2021-08-28 18:47:33', b'1');
INSERT INTO `systemconfig` VALUES (2, 'Grade', 2, 'B', 'B', NULL, 0, 0, '2021-08-28 18:48:35', '2021-08-28 18:48:35', b'1');
INSERT INTO `systemconfig` VALUES (3, 'Grade', 3, 'C', 'C', NULL, 0, 0, '2021-08-28 18:48:35', '2021-08-28 18:48:35', b'1');
INSERT INTO `systemconfig` VALUES (4, 'Grade', 4, 'D', 'D', NULL, 0, 0, '2021-08-28 18:48:35', '2021-08-28 18:48:35', b'1');
INSERT INTO `systemconfig` VALUES (5, 'Grade', 5, 'E', 'E', NULL, 0, 0, '2021-08-28 18:48:35', '2021-08-28 18:48:35', b'1');
INSERT INTO `systemconfig` VALUES (6, 'Oder', 1, 'ShopCart', 'ตระกร้าสินค้า', 'ตระกร้าสินค้า', 0, 0, '2021-09-11 18:28:39', '2021-09-11 18:28:39', b'1');
INSERT INTO `systemconfig` VALUES (7, 'Oder', 2, 'PendingPayment', 'รอชำระเงิน', 'ยืนยันการจอง, รอชำระเงิน', 0, 0, '2021-09-11 18:38:56', '2021-09-11 18:38:56', b'1');
INSERT INTO `systemconfig` VALUES (8, 'Oder', 3, 'Paid', 'ชำระเงินแล้ว', 'ชำระเงินแล้ว, รอจัดส่ง', 0, 0, '2021-09-11 18:38:56', '2021-09-11 18:38:56', b'1');
INSERT INTO `systemconfig` VALUES (9, 'Oder', 4, 'Ordered', 'จัดส่งแล้ว', 'จัดส่งแล้ว', 0, 0, '2021-09-11 18:38:56', '2021-09-11 18:38:56', b'1');

SET FOREIGN_KEY_CHECKS = 1;
