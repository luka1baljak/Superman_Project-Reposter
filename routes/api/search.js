const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
//Trazenje postova po hashovima
router.get("/posts/q=:hash", async (req, res) => {
  try {
    const keyword = "#" + req.params.hash;
    const options = {
      sort: { date: -1 }
    };
    const posts = await Post.paginate(
      { privatno: false, hashlink: keyword },
      options
    );
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/profiles/q=:ime", async (req, res) => {
  try {
    const keyword = req.params.ime;
    const user = await User.find({
      name: keyword
    });
    const options = {
      sort: { date: -1 },
      populate: { path: "user", select: ["name", "avatar"] }
    };

    const profiles = await Profile.paginate(
      {
        privatno: false,
        user: user
      },
      options
    );

    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
