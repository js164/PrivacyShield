const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const adminRoutes = require('./routes/admin');

const port = process.env.PORT || 8000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/', require('./routes/assesment'));
app.use('/question', require('./routes/questions'));
app.use('/assesment', require('./routes/assesment'));

// Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// DB and server
const connectDB = require('./db');
connectDB().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}).catch(err => {
  console.error("❌ DB connection failed", err);
});
// module.exports = app;