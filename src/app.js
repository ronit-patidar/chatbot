const express = require("express");
const cookieParser = require('cookie-parser');
// Routes
const authRoutes = require('../src/routes/auth.routes.js');
const chatRoutes = require('../src/routes/chat.routes.js');
const app = express();
// middlewares
app.use(express.json());
app.use(cookieParser());
// using routes
app.use('/api/auth',authRoutes);
app.use('/api/chat',chatRoutes);

module.exports=app;