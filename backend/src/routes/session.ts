import express from 'express';
var router = express.Router();

// Controller modules
var sessionController = require("../controllers/sessionController");

// Add routes below

// POST request route: /api/group/create
// for creating a new group for a user
router.post("/create", sessionController.create);
router.post("/stop", sessionController.stop);
router.get("/active", sessionController.active);
router.get("/activeAll", sessionController.activeAll);

module.exports = router;