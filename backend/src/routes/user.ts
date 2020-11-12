import express from 'express';
var router = express.Router();

// Controller modules
var userController = require("../controllers/userController");

// Add routes below

// GET request from /api/user/groups
// for retrieving all the groups associated with a spotify_uid
// Called from App.tsx
router.get("/groups", userController.groups);

module.exports = router;