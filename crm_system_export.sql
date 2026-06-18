-- CRM System Database Export File
-- Exported At: 2026-06-18T08:00:00.000Z
-- Database: MySQL compatible representation of MongoDB collections

CREATE DATABASE IF NOT EXISTS `crm_system`;
USE `crm_system`;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(24) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `customers`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` varchar(24) NOT NULL,
  `userId` varchar(24) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `company` varchar(255) NOT NULL,
  `status` enum('New','Contacted','Converted') NOT NULL DEFAULT 'New',
  `value` decimal(10,2) NOT NULL DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Dumping data for table `users`
-- --------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password`, `createdAt`, `updatedAt`) VALUES
('648f10b5f5d314a520e7d001', 'Alex', 'alex@crm.com', '$2a$10$X87hE5K/f2R5HkE6g2lB2exy9d8f8A7b6c5d4e3f2g1h0j9i8k7l6', '2026-06-18 08:00:00', '2026-06-18 08:00:00');

-- --------------------------------------------------------
-- Dumping data for table `customers`
-- --------------------------------------------------------
INSERT INTO `customers` (`id`, `userId`, `name`, `email`, `phone`, `company`, `status`, `value`, `notes`, `createdAt`, `updatedAt`) VALUES
('648f1105f5d314a520e7d002', '648f10b5f5d314a520e7d001', 'Sarah Connor', 'sarah.connor@cyberdyne.com', '+1 (555) 123-4567', 'Cyberdyne Systems', 'Converted', 150000.00, 'Interested in advanced automated security protocols. High value client.', '2026-06-18 08:05:00', '2026-06-18 08:15:00'),
('648f115cf5d314a520e7d003', '648f10b5f5d314a520e7d001', 'Marcus Wright', 'marcus.wright@projectangel.org', '+1 (555) 987-6543', 'Project Angel', 'Contacted', 45000.00, 'Followed up via phone call. Discussed custom support integrations.', '2026-06-18 08:10:00', '2026-06-18 08:20:00'),
('648f11b2f5d314a520e7d004', '648f10b5f5d314a520e7d001', 'Ivy Penn', 'ivy.penn@naturetech.io', '+1 (555) 456-7890', 'NatureTech', 'Converted', 95000.00, 'Contract signed. Onboarding scheduled for next Monday.', '2026-06-18 08:12:00', '2026-06-18 08:25:00'),
('648f121bf5d314a520e7d005', '648f10b5f5d314a520e7d001', 'Jordan Cox', 'jordan.cox@innovatesolutions.com', '+1 (555) 789-0123', 'Innovate Solutions', 'New', 12000.00, 'New lead inbound from landing page contact form.', '2026-06-18 08:14:00', '2026-06-18 08:14:00');
