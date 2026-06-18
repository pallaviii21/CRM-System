const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Customer = require('../models/Customer');
require('dotenv').config();

const exportDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crm_system';
    console.log('Connecting to database for export...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    const users = await User.find({}).lean();
    const customers = await Customer.find({}).lean();

    // 1. Export as JSON
    const exportData = {
      exportedAt: new Date().toISOString(),
      database: 'crm_system',
      collections: {
        users,
        customers
      }
    };

    const jsonOutputPath = path.join(__dirname, '../../crm_system_export.json');
    fs.writeFileSync(jsonOutputPath, JSON.stringify(exportData, null, 2), 'utf-8');
    console.log(`JSON dump saved to: ${jsonOutputPath}`);

    // 2. Export as SQL Script (for MySQL compatibility)
    let sqlContent = `-- CRM System Database Export File
-- Exported At: ${new Date().toISOString()}
-- Database: MySQL compatible representation of MongoDB collections

CREATE DATABASE IF NOT EXISTS \`crm_system\`;
USE \`crm_system\`;

-- --------------------------------------------------------
-- Table structure for table \`users\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` varchar(24) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`email\` varchar(255) NOT NULL UNIQUE,
  \`password\` varchar(255) NOT NULL,
  \`createdAt\` datetime NOT NULL,
  \`updatedAt\` datetime NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table \`customers\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`customers\`;
CREATE TABLE \`customers\` (
  \`id\` varchar(24) NOT NULL,
  \`userId\` varchar(24) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`email\` varchar(255) NOT NULL,
  \`phone\` varchar(50) DEFAULT NULL,
  \`company\` varchar(255) NOT NULL,
  \`status\` enum('New','Contacted','Converted') NOT NULL DEFAULT 'New',
  \`value\` decimal(10,2) NOT NULL DEFAULT 0.00,
  \`notes\` text DEFAULT NULL,
  \`createdAt\` datetime NOT NULL,
  \`updatedAt\` datetime NOT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`userId\` (\`userId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Dumping data for table \`users\`
-- --------------------------------------------------------
`;

    if (users.length > 0) {
      sqlContent += "INSERT INTO `users` (`id`, `name`, `email`, `password`, `createdAt`, `updatedAt`) VALUES\n";
      const userRows = users.map(u => {
        const id = u._id.toString();
        const name = u.name.replace(/'/g, "''");
        const email = u.email.replace(/'/g, "''");
        const password = u.password.replace(/'/g, "''");
        const cAt = new Date(u.createdAt).toISOString().slice(0, 19).replace('T', ' ');
        const uAt = new Date(u.updatedAt).toISOString().slice(0, 19).replace('T', ' ');
        return `('${id}', '${name}', '${email}', '${password}', '${cAt}', '${uAt}')`;
      });
      sqlContent += userRows.join(",\n") + ";\n\n";
    } else {
      sqlContent += "-- No users found to insert\n\n";
    }

    sqlContent += `-- --------------------------------------------------------
-- Dumping data for table \`customers\`
-- --------------------------------------------------------
`;

    if (customers.length > 0) {
      sqlContent += "INSERT INTO `customers` (`id`, `userId`, `name`, `email`, `phone`, `company`, `status`, `value`, `notes`, `createdAt`, `updatedAt`) VALUES\n";
      const customerRows = customers.map(c => {
        const id = c._id.toString();
        const userId = c.userId.toString();
        const name = c.name.replace(/'/g, "''");
        const email = c.email.replace(/'/g, "''");
        const phone = c.phone ? c.phone.replace(/'/g, "''") : '';
        const company = c.company.replace(/'/g, "''");
        const status = c.status;
        const value = c.value || 0;
        const notes = c.notes ? c.notes.replace(/'/g, "''") : '';
        const cAt = new Date(c.createdAt).toISOString().slice(0, 19).replace('T', ' ');
        const uAt = new Date(c.updatedAt).toISOString().slice(0, 19).replace('T', ' ');
        return `('${id}', '${userId}', '${name}', '${email}', '${phone}', '${company}', '${status}', ${value}, '${notes}', '${cAt}', '${uAt}')`;
      });
      sqlContent += customerRows.join(",\n") + ";\n";
    } else {
      sqlContent += "-- No customers found to insert\n";
    }

    const sqlOutputPath = path.join(__dirname, '../../crm_system_export.sql');
    fs.writeFileSync(sqlOutputPath, sqlContent, 'utf-8');
    console.log(`SQL database script saved to: ${sqlOutputPath}`);

    console.log(`\n======================================================`);
    console.log(`Database exported successfully!`);
    console.log(`Users Exported: ${users.length}`);
    console.log(`Customers Exported: ${customers.length}`);
    console.log(`======================================================\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Database export failed:', error);
    process.exit(1);
  }
};

exportDB();
