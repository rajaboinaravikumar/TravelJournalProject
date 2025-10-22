const mongoose = require('mongoose');
const User = require('./src/models/User');
const Journal = require('./src/models/Journal');
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/travel-journal', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(' MongoDB connection error:', error.message);
        process.exit(1);
    }
};
const viewData = async () => {
    try {
        console.log('\n DATABASE CONTENTS\n');
        
        // View Users
        console.log(' USERS:');
        const users = await User.find({}).select('-password');
        if (users.length === 0) {
            console.log('   No users found');
        } else {
            users.forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.firstName} (${user.email})`);
                console.log(`      ID: ${user._id}`);
                console.log(`      Created: ${user.createdAt}`);
                console.log(`      Profile Photo: ${user.profilePhoto || 'None'}`);
                console.log('');
            });
        }
        console.log('JOURNALS:');
        const journals = await Journal.find({}).populate('user', 'firstName email');
        if (journals.length === 0) {
            console.log('   No journals found');
        } else {
            journals.forEach((journal, index) => {
                console.log(`   ${index + 1}. ${journal.location}`);
                console.log(`      ID: ${journal._id}`);
                console.log(`      User: ${journal.user.firstName} (${journal.user.email})`);
                console.log(`      Entry: ${journal.entry.substring(0, 100)}...`);
                console.log(`      Images: ${journal.images.length} images`);
                console.log(`      Tags: ${journal.tags.join(', ') || 'None'}`);
                console.log(`      Created: ${journal.createdAt}`);
                console.log('');
            });
        }
        console.log('SUMMARY:');
        console.log(`   Total Users: ${users.length}`);
        console.log(`   Total Journals: ${journals.length}`);
        
    } catch (error) {
        console.error(' Error viewing data:', error.message);
    } finally {
        mongoose.connection.close();
        console.log('\n Database connection closed');
    }
};
connectDB().then(viewData); 
