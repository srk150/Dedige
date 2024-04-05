-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 05, 2024 at 12:03 PM
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
-- Table structure for table `portfolio`
--

CREATE TABLE `portfolio` (
  `id` int(11) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `descp` longtext NOT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `pimg` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `logo2` varchar(255) DEFAULT NULL,
  `logo3` varchar(255) DEFAULT NULL,
  `logo4` varchar(255) DEFAULT NULL,
  `url` varchar(50) DEFAULT NULL,
  `url2` varchar(50) DEFAULT NULL,
  `url3` varchar(50) DEFAULT NULL,
  `url4` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `portfolio`
--

INSERT INTO `portfolio` (`id`, `type`, `title`, `descp`, `summary`, `pimg`, `logo`, `logo2`, `logo3`, `logo4`, `url`, `url2`, `url3`, `url4`) VALUES
(44, 'left', 'Technology', 'In tech\'s evolving landscape, we lead with cutting-edge solutions. We innovate tech, empowering businesses and individuals.', 'In the dynamic realm of emerging technology, we are constantly working on introducing innovative solutions, transforming the tech sphere to empower both businesses and individuals. Stay tuned, as we are soon unveiling something exciting for all tech enthu', 'pimg-1712310818236-627811543.jpg', '', '', '', '', '', '', '', ''),
(45, 'left', 'Healthcare', 'Our healthcare initiatives prioritize well-being. We are dedicated to delivering accessible, top-notch healthcare solutions that positively impact lives.', '', 'pimg-1712310835771-713333868.png', '', '', '', '', '', '', '', ''),
(46, 'left', 'Hospitality', 'Our luxury culinary ventures prioritize memorable dining experiences. Our restaurants set the standard for world-class hospitality and elevated gastronomy.', '', 'pimg-1712310857708-619199936.jpg', '', '', '', '', '', '', '', ''),
(47, 'left', 'FMCG', 'Fast-Moving Consumer Goods Archana Didige Group leads the FMCG sector with Mego, a household favorite known for top-notch quality.', '', 'pimg-1712310878067-658171714.jpg', '', '', '', '', '', '', '', ''),
(48, 'left', 'Real Estate', 'Our commitment is to achieve excellence. We develop properties reflecting architectural brilliance and fostering thriving communities.', '', 'pimg-1712310907451-946468922.png', '', '', '', '', '', '', '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `portfolio`
--
ALTER TABLE `portfolio`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `portfolio`
--
ALTER TABLE `portfolio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
