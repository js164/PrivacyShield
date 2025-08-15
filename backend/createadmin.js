// CommonJS version so it matches your app
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const AdminUser = require('./models/adminUser');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    const admin = new AdminUser({
        userId: 'admin',
        password: 'admin123'
    });
    await admin.save();
    console.log('✅ Admin user created successfully');
    mongoose.disconnect();
}).catch(err => {
    console.error('❌ Failed to create admin:', err);
    mongoose.disconnect();
});
