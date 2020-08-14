const express = require('express');
const Comment = require('../../modals/comment');
const router = new express.Router();
const auth = require('../../controllers/auth');
const { uniqueNamesGenerator, adjectives, animals } = require('unique-names-generator');

router.post('/comments', auth, async (req, res) => {
  try {
    const { comment, roastId } = req.body;
    if (comment && roastId) {
      const user = req.user;
      const authorAlias = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        length: 2,
      });
      let newComment = new Comment({
        authorAlias,
        comment,
        author: user._id,
        roastId,
      });
      newComment.save();
      res.send({ success: true, message: 'comment added!' });
    } else res.send({ error: true, message: 'required data missing' });
  } catch (error) {
    res.send(error);
  }
});
router.get('/comments', auth, async (req, res) => {
  try {
    const { roastId } = req.body;
    if (roastId) {
      let data = await Comment.find({ roastId });
      res.send({ success: true, data });
    } else throw { error: true, message: 'Roast id required!' };
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
