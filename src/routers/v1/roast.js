const express = require('express');
const Roast = require('../../modals/roast');
const router = new express.Router();
const auth = require('../../middleware/auth');

router.post('/roasts', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (description && title) {
      const user = req.user;
      let roast = new Roast({
        title,
        description,
        userId: user._id,
      });
      roast.save();
      res.send({ success: true, message: 'created successfully' });
    } else {
      res.send({ error: true, message: 'Empty data' });
    }
  } catch (error) {
    res.send(error);
  }
});
router.get('/roasts', auth, async (req, res) => {
  try {
    const user = req.user;
    let data = await Roast.find({ userId: user._id });
    res.send({ success: true, data });
  } catch (error) {
    res.send(error);
  }
});
router.get('/roasts/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const user = req.user;
    let data = Roast.findOne({ _id, userId: user._id });
    if (!data) throw { error: true, message: 'Task not found!' };
    else res.send({ success: true, data });
  } catch (error) {
    res.send(error);
  }
});

router.delete('/roasts/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const user = req.user;
    const roast = await Roast.findOneAndDelete({ _id, owner: user._id });
    if (!roast) throw { error: true, message: 'unable to delete' };
    else res.send(task);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
