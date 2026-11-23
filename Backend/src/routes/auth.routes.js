const express = require('express');
const authControllers = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();



router.post("/register", authControllers.registerUser)
router.post("/login", authControllers.loginUser)
router.get("/logout", authControllers.logoutUser)
router.get("/profile", authMiddleware.authUser, authControllers.getUserProfile)



module.exports = router;