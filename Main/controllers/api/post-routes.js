const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

//const withAuth = require('../../utils/auth');

// GET /api/posts
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method
    Post.findAll({})
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/new', (req, res) => {

    console.log(req.body)
    console.log(req.session)

    

    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id

    })
    .then(newPostData => {
        res.redirect('/dashboard')
    })
    .catch(err => {
    console.log(err)
    res.send(err)
    });

});

router.post('/update', (req, res) => {

    console.log(req.body)
    console.log(req.session)

    Post.update(
        {
          // All the fields you can update and the data attached to the request body.
          title: req.body.title,
          content: req.body.content
        },
        {
          // Gets a book based on the book_id given in the request parameters
          where: {
            id: req.body.post_id,
          },
        }
      )
        .then((updatedPost) => {
          res.redirect('/dashboard');
        })
        .catch((err) => {
          console.log(err);
          res.json(err);
        });


});

module.exports = router