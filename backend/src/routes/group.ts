import express from 'express';
var router = express.Router();

// Controller modules
var groupController = require("../controllers/groupController");

// Add routes below

// POST request route: /api/group/create
// for creating a new group for a user
router.post("/create", groupController.create);
router.post("/join", groupController.join);
router.post("/leave", groupController.leave);
router.get("/members", groupController.members);

module.exports = router;