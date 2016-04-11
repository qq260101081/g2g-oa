-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2016-04-11 09:45:38
-- 服务器版本： 5.7.11
-- PHP Version: 5.5.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `oa`
--

-- --------------------------------------------------------

--
-- 表的结构 `factory`
--

CREATE TABLE IF NOT EXISTS `factory` (
  `id` int(11) NOT NULL,
  `zh_name` char(60) NOT NULL,
  `en_name` char(60) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `factory`
--

INSERT INTO `factory` (`id`, `zh_name`, `en_name`) VALUES
(1, '广州力侬照明技术有限公司', 'LN'),
(2, '深圳市美耐斯光电有限公司', 'MY'),
(3, '中山市泰然光电科技有限公司', 'TP'),
(4, '东莞市红富照明科技有限公司', 'ST');

-- --------------------------------------------------------

--
-- 表的结构 `product_orders`
--

CREATE TABLE IF NOT EXISTS `product_orders` (
  `id` int(11) NOT NULL,
  `user_id` int(10) unsigned DEFAULT '0',
  `factory_zh_name` char(60) DEFAULT NULL,
  `factory_en_name` varchar(90) DEFAULT NULL,
  `product_model` varchar(100) DEFAULT NULL,
  `order_no` char(30) DEFAULT NULL,
  `status` enum('ordered','waitreply','complete','close') DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `lamp_bead_code` varchar(120) DEFAULT NULL,
  `jet_coding` varchar(100) DEFAULT NULL,
  `number` mediumint(9) unsigned DEFAULT '0',
  `real_number` int(10) unsigned DEFAULT '0',
  `order_time` int(11) DEFAULT '0',
  `plan_delivery_time` int(11) DEFAULT '0',
  `factory_plan_delivery_time` int(11) unsigned NOT NULL DEFAULT '0',
  `created_at` int(11) DEFAULT '0',
  `picked_at` int(10) unsigned DEFAULT '0',
  `produce_at` int(10) unsigned DEFAULT '0',
  `real_delivery_at` int(10) unsigned DEFAULT '0',
  `order_close_at` int(10) unsigned DEFAULT '0',
  `remark` varchar(500) DEFAULT NULL,
  `close_remark` varchar(500) DEFAULT NULL,
  `factory_remark` varchar(500) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `product_orders`
--

INSERT INTO `product_orders` (`id`, `user_id`, `factory_zh_name`, `factory_en_name`, `product_model`, `order_no`, `status`, `price`, `lamp_bead_code`, `jet_coding`, `number`, `real_number`, `order_time`, `plan_delivery_time`, `factory_plan_delivery_time`, `created_at`, `picked_at`, `produce_at`, `real_delivery_at`, `order_close_at`, `remark`, `close_remark`, `factory_remark`) VALUES
(35, 9, '广州力侬照明技术有限公司', 'LN', 'AURORA I GENIV（LNMS5NW3ALE65G-CC12）', 'G2G20160410LNP-1', 'waitreply', '1.00', '1rwr', NULL, 100, 0, 1460246400, 1460678400, 1461283200, 1460272615, 0, 0, 0, 0, '下单濑', NULL, 'dfghj'),
(36, 9, '深圳市美耐斯光电有限公司', 'MY', 'AURORA R（LNMD5R4ALE65G-D12）', 'G2G20160410MYP-2', 'ordered', '1.00', 'err', NULL, 1000, 0, 1460246400, 1460592000, 0, 1460274277, 0, 0, 0, 0, '', NULL, '');

-- --------------------------------------------------------

--
-- 表的结构 `product_repertory`
--

CREATE TABLE IF NOT EXISTS `product_repertory` (
  `id` int(11) NOT NULL,
  `product_type` enum('lamp','product') NOT NULL,
  `order_no` varchar(100) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `number` int(10) unsigned NOT NULL,
  `shipment_number` int(10) unsigned NOT NULL,
  `shipmented_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) unsigned NOT NULL,
  `username` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `type` enum('g2g','factory') COLLATE utf8_unicode_ci NOT NULL,
  `tel` char(15) COLLATE utf8_unicode_ci NOT NULL,
  `mobile` char(15) COLLATE utf8_unicode_ci NOT NULL,
  `auth_key` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` char(65) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8_unicode_ci NOT NULL,
  `created_at` int(10) unsigned NOT NULL DEFAULT '0',
  `updated_at` int(10) unsigned NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `username`, `type`, `tel`, `mobile`, `auth_key`, `password_hash`, `email`, `status`, `created_at`, `updated_at`) VALUES
(1, 'factory', 'factory', '0', '0', 'XFNe2Lu1I8nnb3XNQNhT2OoRDV1YgqWH', '$2y$13$EgcZe15RcT6r3FwunLOg8.suXwPYHwkDHRNf0y4/6IP7Vjca/3Khu', '234343@qq.com', 'active', 1429181621, 0),
(9, '小杨', 'g2g', '0', '0', 'rgWR2CX7yN_QC0uesyVLPbrFEqhad7jw', '$2y$13$EgcZe15RcT6r3FwunLOg8.suXwPYHwkDHRNf0y4/6IP7Vjca/3Khu', '601031331@qq.com', 'active', 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `factory`
--
ALTER TABLE `factory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_orders`
--
ALTER TABLE `product_orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_repertory`
--
ALTER TABLE `product_repertory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `factory`
--
ALTER TABLE `factory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `product_orders`
--
ALTER TABLE `product_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=37;
--
-- AUTO_INCREMENT for table `product_repertory`
--
ALTER TABLE `product_repertory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
