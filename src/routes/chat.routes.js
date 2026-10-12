const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware.js');
const chatController = require('../controllers/chat.controller.js');


// POST /api/chat/
router.post('/',authMiddleware.authUser,chatController.createChat);


module.exports = router;