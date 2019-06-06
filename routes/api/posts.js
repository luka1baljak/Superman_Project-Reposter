const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const getUrls = require('get-urls');
const isImageUrl = require('is-image-url');

//POST api/posts route - Stvaranje posta
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Potrebno je ispuniti polje za tekst')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'User ne postoji' }] });
      }

      //Ovaj dio koda uzima riječi iz teksta posta, traži riječi sa znakom #
      //Te onda uklanja točke,zareze i dvotočke sa kraja riječi ako postoje
      const arrOfWords = req.body.text.split(' ');
      const arrOfHash = arrOfWords
        .filter(elem => elem.indexOf('#') === 0)
        .map(elem =>
          elem[elem.length - 1] === ',' ||
          elem[elem.length - 1] === '.' ||
          elem[elem.length - 1] === ':'
            ? (elem = elem.substring(0, elem.length - 1).toLowerCase())
            : elem.toLowerCase()
        );

      //Razdvaja linkove na youtube linkove, linkove slika te ostale
      const arrOfUrls = [...getUrls(req.body.text)];
      const regularLinks = [];
      const imageLink = [];
      const youtubeLink = arrOfUrls.filter(elem => {
        if (
          elem.includes('youtube') ||
          elem.includes('vimeo') ||
          elem.includes('twitch') ||
          elem.includes('soundcloud')
        ) {
          return elem;
        } else if (isImageUrl(elem)) {
          imageLink.unshift(elem);
        } else {
          regularLinks.unshift(elem);
        }
      });
      /* const ytCode = youtubeLink.map(elem => {
        const arr = elem.split("=");
        arr.shift();
        return arr.join("");
      });*/
      //Stvara novi post i sprema ga u bazu, te podatke šalje kao odgovor
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        privatno: req.body.privatno,
        ytlink: youtubeLink[0],
        imglink: imageLink[0],
        hashlink: arrOfHash,
        reglinks: regularLinks,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//GET api/posts - dohvaćanje svih postova
router.get('/', async (req, res) => {
  try {
    const { page, perPage } = req.query;
    const options = {
      sort: { date: -1 },
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10
    };

    const posts = await Post.paginate({ privatno: false }, options);

    if (!posts) {
      return res.status(404).json({ msg: 'Nemoguće dohvatiti postove' });
    }

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Dohvaćannje postova od određenog usera
//GET api/posts/user_posts/:user_id
router.get('/user_posts/:user_id', async (req, res) => {
  try {
    const { page, perPage } = req.query;
    const options = {
      sort: { date: -1 },
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10
    };

    const posts = await Post.paginate({ user: req.params.user_id }, options);

    if (!posts) {
      return res.status(404).json({ msg: 'Nemoguće dohvatiti postove' });
    }

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/posts/:id - dohvaćanje posta po idu
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Ne postoji taj post' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ne postoji taj post' });
    }
    res.status(500).send('Server Error');
  }
});

//DELETE api/posts/:id - brisanje posta po idu
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Ne postoji taj post' });
    }

    //Check da je user kreator posta
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Niste authorizirani za tu radnju' });
    }

    await post.remove();

    res.json({ msg: 'Post je izbrisan' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ne postoji taj post' });
    }
    res.status(500).send('Server Error');
  }
});

//LIKEOVI
//PUT api/posts/like/:id - Lajkanje posta preko id-a (od posta)
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Provjeriti da li je user vec lajkao post
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(401).json({ msg: 'Već ste lajkali taj post' });
    }
    //dodati usera u like array
    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ne postoji taj post' });
    }
    res.status(500).send('Server Error');
  }
});

//PUT api/posts/unlike/:id - UnLajkanje posta
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Provjeriti da li je post vec lajkan od ovog usera
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: 'Post nije lajkan' });
    }

    //Get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ne postoji taj post' });
    }
    res.status(500).send('Server Error');
  }
});

//POST api/posts/comment/:id route - Komentiranje posta preko id posta
router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //Pronaci usera koji komentira i post koji se komentira
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.push(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// DELETE api/post/comment/:id/comment_id - brisanje komentara po post idu i id-u komentara
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    //Pronaci post sa kojeg treba obrisati
    const post = await Post.findById(req.params.id);

    //Naci kommentar za brisanje
    const commentX = post.comments.find(
      comment => comment.id === req.params.comment_id // comment => je zapravo for each!
    );

    //Da li komentar postoji?
    if (!commentX) {
      return res.status(404).json({ msg: 'Komentar ne postoji' });
    }

    //Provjera Usera
    if (commentX.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Niste authorizirani za tu radnju' });
    }

    //Pronaci index za birsanje
    const removeIndex = post.comments
      .map(comment => comment.id.toString())
      .indexOf(commentX.id.toString());

    post.comments.splice(removeIndex, 1);

    post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Traženje postova za my Feed
//Get na api/posts/myfeed/posts
router.get('/myfeed/posts', auth, async (req, res) => {
  try {
    //Pronadji profil trenutnog Usera i
    const prof = await Profile.findOne({ user: req.user.id });

    //Idovi usera koje followamo i id trenutnog usera
    const followingIds = prof.following.map(p => p._id.toString());
    const followingAndUserIds = [...followingIds, req.user.id.toString()];

    const { page, perPage } = req.query;
    const options = {
      sort: { date: -1 },
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10
    };
    //Pronadji sve postove kojima se user nalazi u arrayu
    const posts = await Post.paginate(
      { privatno: false, user: followingAndUserIds },
      options
    );
    if (!posts) {
      return res.status(404).json({ msg: 'Nemoguće dohvatiti postove' });
    }
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
