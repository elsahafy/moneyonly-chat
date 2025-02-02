const mongoose = require('mongoose');
require('dotenv').config();

async function removeIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the User collection
    const User = mongoose.connection.collection('users');

    // Get all indexes
    const indexes = await User.indexes();
    console.log('Current indexes:', indexes);

    // Drop all indexes except _id
    await User.dropIndexes();
    console.log('All indexes dropped successfully');

    // Create only the necessary indexes
    await User.createIndex({ email: 1 }, { unique: true });
    console.log('Email index recreated');

    console.log('Index cleanup completed successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

removeIndexes();
