const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const gravatar = require("gravatar");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const multer = require("multer");

//Profile picture prilikom registracije
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
});

//POST api/users route - registriranje usera(stvaranje)
router.post(
  "/",
  [
    upload.single("avatar"), //Profile picture
    check("name", "Morate ispuniti polje za Ime") //Ime je potrebno
      .not()
      .isEmpty(),
    check("email", "Molimo unesite valjanu e-mail adresu").isEmail(), //Email je oblik email
    check("password", "Lozinka mora biti imati barem 4 znaka").isLength({
      min: 4
    }) //pass ima barem 4 znaka
  ],
  async (req, res) => {
    const errors = validationResult(req); //errori

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //errori
    }
    //Destructuring podataka
    const { name, email, password } = req.body;
    //Da li postoji user ili njegov email
    try {
      let user = await User.findOne({ email });
      //Ako postoji vec, izbaci error
      if (user) {
        return res.status(400).json({
          errors: [{ msg: "User sa tom e-mail adresom već postoji" }]
        });
      }
      let avatar;
      //Ako ne, nastavi praviti usera
      if (req.file) {
        avatar = req.file.path;
      } else {
        //Ako profile picture nije odabran povuci sliku iz gravatara
        //Gravatar image moze postojati ili biti default
        avatar = gravatar.url(email, {
          s: "200", //Size
          r: "pg", //Rating
          d: "mm" //Default
        });
      }

      user = new User({
        name,
        email,
        password,
        avatar
      });

      //Encryptat pass i saveat usera
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //Returnat jsonwebtoken - da se odma login
      //Payload sa userovim id-om
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"), //secret
        { expiresIn: 360000 }, //optional expiracija
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
