const express = require('express');
const artistController = require('../controllers/artist');

const router = express.Router();

router.post('/', artistController.createArtist);
router.get('/', artistController.readArtists);
router.get('/:id', artistController.readArtist);

module.exports = router;