// backend/seedAdmin.js
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await connectDB();

    const exists = await User.findOne({
      email: 'admin@thefolio.com',
    });

    if (exists) {
      console.log('Admin account already exists.');
      process.exit();
    }

    await User.create({
      name: 'TheFolio Admin',
      email: 'admin@thefolio.com',
      password: 'Admin@1234',
      role: 'admin',
    });

    console.log('Admin account created successfully!');
    console.log('Email: admin@thefolio.com');
    console.log('Password: Admin@1234');

    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();