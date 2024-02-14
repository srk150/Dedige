-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2024 at 11:38 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `portfolio_web`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth`
--

CREATE TABLE `auth` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `role` varchar(255) NOT NULL,
  `occupation` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `auth`
--

INSERT INTO `auth` (`id`, `username`, `name`, `email`, `mobile`, `role`, `occupation`, `password`, `profile`) VALUES
(1, 'Srk15', 'Sharukh Khan', 'admin@gmail.com', '799961165', 'Admin', 'Owner', '$2b$08$PKNwRv8kC9GssyhDdlCqne4zXe7XEgkvyZM4j.YOpMPicDVR/LfN6', 'profilepic-1707903465547-329946104.png');

-- --------------------------------------------------------

--
-- Table structure for table `partners`
--

CREATE TABLE `partners` (
  `pid` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `descp` longtext NOT NULL,
  `partner_img` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `partners`
--

INSERT INTO `partners` (`pid`, `title`, `descp`, `partner_img`) VALUES
(20, 'Demo Test', 'As a result of being made of a substance that is equivalent to that of natural diamonds, eco diamonds have an identical level of brilliance and shine. They contain real carbon atoms that are properly arranged within the distinctive diamond crystal structure.\r\n\r\n', 'partner_imgs-1707903934651-818374429.png, partner_imgs-1707903934651-173008879.jpg, partner_imgs-1707903934654-478452388.jpg'),
(21, 'As a result of being made of a substance that is equivalent to that of natural diamonds, eco diamonds have an identical level of brilliance and shine. They contain real carbon atoms that are properly arranged within the distinctive diamond crystal structu', 'As a result of being made of a substance that is equivalent to that of natural diamonds, eco diamonds have an identical level of brilliance and shine. They contain real carbon atoms that are properly arranged within the distinctive diamond crystal structure.\r\n\r\nAs a result of being made of a substance that is equivalent to that of natural diamonds, eco diamonds have an identical level of brilliance and shine. They contain real carbon atoms that are properly arranged within the distinctive diamond crystal structure.\r\n\r\n', 'partner_imgs-1707903982537-66561494.jpg, partner_imgs-1707903982539-999176810.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `portfolio`
--

CREATE TABLE `portfolio` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `descp` longtext NOT NULL,
  `pimg` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `portfolio`
--

INSERT INTO `portfolio` (`id`, `title`, `descp`, `pimg`, `logo`) VALUES
(20, 'As a result of being made of a substance that is equivalent to that of natural diamonds, eco diamonds have an identical level of brilliance and shine. They contain real carbon atoms that are properly arranged within the distinctive diamond crystal structu', 'As a result of being made of a substance that is equivalent to that of natural diamonds, eco diamonds have an identical level of brilliance and shine. They contain real carbon atoms that are properly arranged within the distinctive diamond crystal structu', 'pimg-1707904015309-915265141.jpg', 'logo-1707904015305-232001643.jpg, logo-1707904015307-676548888.jpg'),
(21, 'As a result of being made of a substance that is equivalent to that of natural diamonds, eco diamonds have an identical level of brilliance and shine. They contain real carbon atoms that are properly arranged within the distinctive diamond crystal structu', 'As a result of being made of a substance that is equivalent to that of natural diamonds, eco diamonds have an identical level of brilliance and shine. They contain real carbon atoms that are properly arranged within the distinctive diamond crystal structure.\r\n\r\nAs a result of being made of a substance that is equivalent to that of natural diamonds, eco diamonds have an identical level of brilliance and shine. They contain real carbon atoms that are properly arranged within the distinctive diamond crystal structure.\r\n\r\nAs a result of being made of a substance that is equivalent to that of natural diamonds, eco diamonds have an identical level of brilliance and shine. They contain real carbon atoms that are properly arranged within the distinctive diamond crystal structure.\r\n\r\nAs a result of being made of a substance that is equivalent to that of natural diamonds, eco diamonds have an identical level of brilliance and shine. They contain real carbon atoms that are properly arranged within the distinctive diamond crystal structure.\r\n\r\nAs a result of being made of a substance that is equivalent to that of natural diamonds, eco diamonds have an identical level of brilliance and shine. They contain real carbon atoms that are properly arranged within the distinctive diamond crystal structure.\r\n\r\nAs a result of being made of a substance that is equivalent to that of natural diamonds, eco diamonds have an identical level of brilliance and shine. They contain real carbon atoms that are properly arranged within the distinctive diamond crystal structure.\r\n\r\n', 'pimg-1707904079410-325810388.jpg', 'logo-1707904079410-140620755.jpg, logo-1707904079410-934194940.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth`
--
ALTER TABLE `auth`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `partners`
--
ALTER TABLE `partners`
  ADD PRIMARY KEY (`pid`);

--
-- Indexes for table `portfolio`
--
ALTER TABLE `portfolio`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth`
--
ALTER TABLE `auth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `partners`
--
ALTER TABLE `partners`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `portfolio`
--
ALTER TABLE `portfolio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
