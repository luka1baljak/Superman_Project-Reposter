const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator/check");
const config = require("config");

//GET api/auth route - vraća autentificiranog usera
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//POST api/auth route - autentifikacija usera (login)
router.post(
  "/",
  [
    check("email", "Molimo unesite valjanu e-mail adresu").isEmail(), //Zahtijeva se oblik e-maila
    check("password", "Polje za lozinku je prazno").exists() //pass je upisan
  ],
  async (req, res) => {
    const errors = validationResult(req); //errori

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //errori
    }
    //Destructuring podataka iz bodija zahtjeva
    const { email, password } = req.body;
    //Provjera da li user postoji preko email-a
    try {
      let user = await User.findOne({ email });
      //Ako ne postoji user, izbaci error
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Vaši podaci nisu točni" }] });
      }

      //Da li su sifre- koju je unio user i od user koji se poslao tokenom jednake
      const isMatch = await bcrypt.compare(password, user.password);
      //Ako nisu jednake izbaci error
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Vaši podatci nisu točni" }] });
      }

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