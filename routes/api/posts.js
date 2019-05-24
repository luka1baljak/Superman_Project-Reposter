const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const getUrls = require("get-urls");
const isImageUrl = require("is-image-url");

//POST api/posts route - Stvaranje posta
router.post(
  "/",
  [
    auth,
    [
      check("text", "Potrebno je ispuniti polje za tekst")
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
      const user = await User.findById(req.user.id).select("-password");

      if (!user) {
        return res.status(400).json({ errors: [{ msg: "User ne postoji" }] });
      }

      const theUrls = getUrls(req.body.text);
      const arrOfUrls = [...theUrls];
      const arrOfHash = req.body.text.split(" ");
      const arr3 = [];
      for (let i = 0; i < arrOfHash.length; i++) {
        if (arrOfHash[i].indexOf("#") === 0) {
          if(arrOfHash[i][arrOfHash[i].length-1]===',' || arrOfHash[i][arrOfHash[i].length-1]==='.' || arrOfHash[i][arrOfHash[i].length-1]===':'){
            arrOfHash[i]=arrOfHash[i].substring(0,arrOfHash[i].length-1 );
          }
          arr3.unshift(arrOfHash[i]);
        }
      }
      console.log(arr3);
      var youtubeLink=[];
      var regularLinks=[];
      for (let i = 0; i < arrOfUrls.length; i++) {
        if (arrOfUrls[i].includes("youtube")) {
          const ytlink = arrOfUrls[i].split("=");
          ytlink.shift();
          youtubeLink = ytlink.join("");
          console.log("Youtube splited:", youtubeLink);
        }else if(isImageUrl(arrOfUrls[i])){
          var imageLink=arrOfUrls[i];
        }else{
          regularLinks.unshift(arrOfUrls[i]);
        }
      }

      if(typeof youtubeLink !== "string"){
        youtubeLink="";
      }
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        privatno: req.body.privatno,
        ytlink: youtubeLink,
        imglink: imageLink,
        hashlink: arr3,
        reglinks:regularLinks,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//GET api/posts - dohvaćanje svih postova
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ privatno: false }).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//GET api/posts/:id - dohvaćanje posta po idu
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Ne postoji taj post" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Ne postoji taj post" });
    }
    res.status(500).send("Server Error");
  }
});

//DELETE api/posts/:id - brisanje posta po idu
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Ne postoji taj post" });
    }

    //Check da je user kreator posta
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Niste authorizirani za tu radnju" });
    }

    await post.remove();

    res.json({ msg: "Post je izbrisan" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Ne postoji taj post" });
    }
    res.status(500).send("Server Error");
  }
});

//LIKEOVI
//PUT api/posts/like/:id - Lajkanje posta preko id-a (od posta)
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Provjeriti da li je user vec lajkao post
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(401).json({ msg: "Već ste lajkali taj post" });
    }
    //dodati usera u like array
    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Ne postoji taj post" });
    }
    res.status(500).send("Server Error");
  }
});

//PUT api/posts/unlike/:id - UnLajkanje posta
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Provjeriti da li je post vec lajkan od ovog usera
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post nije lajkan" });
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
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Ne postoji taj post" });
    }
    res.status(500).send("Server Error");
  }
});

//POST api/posts/comment/:id route - Komentiranje posta preko id posta
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is required")
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
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// DELETE api/post/comment/:id/comment_id - brisanje komentara po post idu i id-u komentara
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    //Pronaci post sa kojeg treba obrisati
    const post = await Post.findById(req.params.id);

    //Naci kommentar za brisanje
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id // comment => je zapravo for each!
    );

    //Da li komentar postoji?
    if (!comment) {
      return res.status(404).json({ msg: "Komentar ne postoji" });
    }

    //Provjera Usera
    if (comment.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Niste authorizirani za tu radnju" });
    }

    //Pronaci index za birsanje
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
