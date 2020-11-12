import express from 'express';
var router = express.Router();

// Controller modules
var spotifyController = require("../controllers/spotifyController");

// Add routes below

// GET request route: /api/spotify/login
// for logging into Spotify
// Called from Landing.tsx
router.get("/login", spotifyController.login);

// GET request route: /api/spotify/callback
// for after a user accepts or denies Spotify authentication
router.get("/callback", spotifyController.callback);

module.exports = router;