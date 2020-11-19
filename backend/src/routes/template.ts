import express from 'express';
var router = express.Router();

// Controller modules
var xxxController = require("../controllers/xxxController");

// Add routes below

// POST request route: /
// for
router.post("/yyy", xxxController.yyy);

module.exports = router;