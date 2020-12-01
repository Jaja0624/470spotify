import express from 'express';
var router = express.Router();

// Controller modules
var adminController = require("../controllers/adminController");

// Add routes below

// POST request route: /api/admin/login
// for verifying admin credentials with the db
router.post("/login", adminController.login);

module.exports = router;