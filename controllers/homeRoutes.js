const router = require('express').Router();
const { Post, User, Comment } = require('../Main/models');
const withAuth = require('../Main/utils/auth');

router.get('/', async (req, res) => {
  console.log("Root route")
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: ['content']
        }
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));
    console.log(posts)
    res.render('homepage', {
      loggedIn:req.session.loggedIn,
      posts: posts
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.get('/dashboard', async (req, res) => {
  console.log(req.session)
  try {
    const postData = await Post.findAll({
      where: {
        user_id: req.session.user_id
      },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: ['content']
        }
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));
  
    // Pass serialized data and session flag into template
    res.render('dashboard', {
      loggedIn: req.session.loggedIn,
      posts: posts
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
 
})

router.get('/dashboard/create', (req, res) => {

  res.render('newpost', {
    loggedIn: (req.session.user_id !== undefined) ? true : false
  })

})


       

router.get('/post/edit/:id', withAuth, (req, res) => {

  
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'title',
      'date_created',
      'content'
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'content', 'post_id', 'user_id', 'date_created'],
        include: {
          model: User,
          attributes: ['username', 'twitter', 'github']
        }
      },
      {
        model: User,
        attributes: ['username', 'twitter', 'github']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });

      res.render('editpost', {
          ...post,
          loggedIn: req.session.loggedIn
          });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });

    
});

router.get('/post/:id', withAuth, (req, res) => {
  console.log("SINGLE POST")
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'title',
      'date_created',
      'content'
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'content', 'post_id', 'user_id', 'date_created'],
        include: {
          model: User,
          attributes: ['username', 'twitter', 'github']
        }
      },
      {
        model: User,
        attributes: ['username', 'twitter', 'github']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });
      console.log(post)
      res.render('singlepost', {
         post: post,
          loggedIn: true
          });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] }
 
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.loggedIn) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {

  res.render('signup')

})

module.exports = router;