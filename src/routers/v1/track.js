const express = require('express');
const Track = require('../../models/track');
const router = new express.Router();
const auth = require('../../controllers/auth');

router.post('/tracks', auth, async (req, res) => {
  const tracks = req.body;
  await Track.insertMany(tracks);
  res.send({ success: true, message: 'Thank You for your contribution' });
});
module.exports = router;
