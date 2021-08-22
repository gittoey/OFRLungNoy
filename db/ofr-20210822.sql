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

 Date: 22/08/2021 22:08:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `UserID` int(20) NOT NULL AUTO_INCREMENT,
  `Type` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'US',
  `Username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Active` bit(1) NOT NULL DEFAULT b'0',
  `NewDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `UpdateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`UserID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'US', 'toey', '1234', 'PS', b'0', '2021-08-14 23:39:25', '2021-08-14 23:39:25');
INSERT INTO `user` VALUES (12, 'US', 'toey2', '1234', 'พีรพัฒน์ สุระสิงห์', b'0', '2021-08-15 20:22:31', '2021-08-15 20:22:31');

-- ----------------------------
-- Table structure for varieties
-- ----------------------------
DROP TABLE IF EXISTS `varieties`;
CREATE TABLE `varieties`  (
  `VarietiesID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Meat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Smell` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Flavor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DeliciousTerm` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Decs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `CreateBy` int(11) NOT NULL,
  `UpdateBy` int(11) NOT NULL,
  `CreateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `UpdateDate` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `Active` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`VarietiesID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of varieties
-- ----------------------------
INSERT INTO `varieties` VALUES (15, 'หมอนทอง', 'upload/VarietiesImg/Fest_Blog_Jun2021_lot2_2-20210821111825.png', 'เนื้อเยอะ เนื้อแน่น มีสีเหลืองอ่อน', 'หอมอ่อนๆ ไม่แรงมาก', 'หวาน', 'สุกพอดี', 'ลูกใหญ่และเนื้อเยอะกว่าพันธุ์อื่น เมล็ดลีบ เนื้อสีเหลืองอ่อนนุ่ม กลิ่นไม่แรงมาก มีรสหวานมาก หาได้ง่ายที่สุด เมื่องอมแล้วเนื้อจะไม่แฉะ นิยมเอาไปแปรรูปเป็นทุเรียนกวน ทุเรียนแช่แข็ง', 0, 0, '2021-08-21 18:18:25', '2021-08-21 18:18:25', b'1');
INSERT INTO `varieties` VALUES (16, 'ชะนี', 'upload/VarietiesImg/Nuantong_03-20210821112950.jpg', 'เนื้อสีเหลืองเข้ม เหนียว มีเส้นใยมาก', 'กลิ่นแรง', 'หวานจัด', '-', 'เนื้อสีเหลืองเข้ม เหนียว มีเส้นใยมาก กลิ่นแรง มีรสหวานจัดแหลมมาก เมล็ดเล็กและมีเมล็ดน้อย เมื่องอมแล้วจะเละส่งกลิ่นแรงกว่าเดิม นิยมเอาไปทำข้าวเหนียวทุเรียน ไอศกรีมทุเรียน ที่ต้องมีกลิ่นทุเรียนโดดเด่น', 0, 0, '2021-08-21 18:29:50', '2021-08-22 22:05:12', b'1');
INSERT INTO `varieties` VALUES (17, 'ก้านยาว', 'upload/VarietiesImg/ArticlePic_1670x1095-06-4-20210822135425.jpg', 'เนื้อละเอียด', 'ลิ่นอ่อนไม่ฉุน', 'รสชาติมันมากกว่าหวาน', '12345', 'ถือเป็นสุดยอดของทุเรียนนนท์ ราคาบางพื้นที่ขายกันกก. ละนับพันบาท แต่ความอร่อยก็สูงไม่แพ้ราคาทีเดียว', 0, 0, '2021-08-22 20:54:25', '2021-08-22 22:06:50', b'1');

SET FOREIGN_KEY_CHECKS = 1;
