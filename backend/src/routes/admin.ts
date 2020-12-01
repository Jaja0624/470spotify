import express from 'express';
var router = express.Router();

// Controller modules
var adminController = require("../controllers/adminController");

// Add routes below

// POST request route: /api/admin/login
// for verifying admin credentials with the db
router.post("/login", adminController.login);

// POST request route: /api/admin/appuser
// for retrieving all rows in the AppUser table
router.post("/appuser", adminController.appuser);

// POST request route: /api/admin/appgroup
// for retrieving all rows in the AppGroup table
router.post("/appgroup", adminController.appgroup);

// POST request route: /api/admin/groupmember
// for retrieving all rows in the GroupMember table
router.post("/groupmember", adminController.groupmember);

// POST request route: /api/admin/appsession
// for retrieving all rows in the AppSession table
router.post("/appsession", adminController.appsession);

// POST request route: /api/admin/sessionadmin
// for retrieving all rows in the SessionAdmin table
router.post("/sessionadmin", adminController.sessionadmin);

// POST request route: /api/admin/apphistory
// for retrieving all rows in the AppHistory table
router.post("/apphistory", adminController.apphistory);

module.exports = router;