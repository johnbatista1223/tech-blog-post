const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');


router.post('/', withAuth, (req, res) => {
    console.log(req.body)
    console.log(req.session)
  // check the session
  if (req.session) {
    Comment.create({
      content: req.body.content,
      post_id: req.body.post_id,
      // use the id from the session
      user_id: req.session.user_id,
    })
      .then(dbCommentData => res.redirect(`/post/${req.body.post_id}`))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  }
});



module.exports = router;