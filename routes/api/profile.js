const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
//const { check, validationResult } = require("express-validator/check");

//GET api/profile/me route - Profile trenutnog usera
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'Ovaj user nema profil' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//POST api/profile - stvaranje i updateanje user profila
router.post('/', auth, async (req, res) => {
  //destruktuiranje podataka
  const {
    datum_rodjenja,
    broj_telefona,
    lokacija,
    životni_moto,
    privatno,
    instagram,
    twitter,
    facebook
  } = req.body;
  //profileFields - prazan objekt
  const profileFields = {};
  profileFields.user = req.user.id;
  if (datum_rodjenja) profileFields.datum_rodjenja = datum_rodjenja;
  if (broj_telefona) profileFields.broj_telefona = broj_telefona;
  if (lokacija) profileFields.lokacija = lokacija;
  if (životni_moto) profileFields.životni_moto = životni_moto;
  if (privatno) {
    profileFields.privatno = true;
  } else {
    profileFields.privatno = false;
  }

  //Build social object
  profileFields.social = {};
  if (instagram) profileFields.social.instagram = instagram;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;

  try {
    //Nadji profil po request user.id
    let profile = await Profile.findOne({ user: req.user.id });
    //Ako profil vec postoji - updateaj ga
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    }
    //Ako ga ne pronadje onda ga kreira
    profile = new Profile(profileFields);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/profile - nadji sve profile
router.get('/', async (req, res) => {
  try {
    const { page, perPage } = req.query;
    const options = {
      sort: { date: -1 },
      populate: { path: 'user', select: ['name', 'avatar'] },
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10
    };

    const profiles = await Profile.paginate({ privatno: false }, options);
    //const profiles2 = await Profile.find({ privatno:false }).populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//GET api/profile/user/:user_id - nadji profil po user_id-u
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profil ne postoji' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profil ne postoji' });
    }
    res.status(500).send('Server Error');
  }
});

//DELETE api/profile - brise profil i usera
router.delete('/', auth, async (req, res) => {
  try {
    //Izbrise profil
    await Profile.findOneAndRemove({ user: req.user.id });
    //Izbrise Usera
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User izbrisan' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Followanje
//PUT api/profile/follow/:id - Followanje profila usera /
//User koji followa dobije zapis u following polje, a user kojeg se followa dobije zapis u followers polje
router.put('/follow/:id', auth, async (req, res) => {
  try {
    const followed_profile = await Profile.findById(req.params.id);
    const following_profile = await Profile.findOne({ user: req.user.id });

    if (
      followed_profile.followers.filter(follower => follower.id == req.user.id)
        .length > 0
    ) {
      return res
        .status(400)
        .json({ msg: 'You are already following that user!' });
    }

    const followed_user = await User.findById(followed_profile.user._id).select(
      '-password -email'
    );
    const following_user = await User.findById(req.user.id).select(
      '-password -email'
    );

    followed_profile.followers.unshift(following_user);
    following_profile.following.unshift(followed_user);

    await followed_profile.save();
    await following_profile.save();

    res.json(followed_profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ne postoji taj user' });
    }
    res.status(500).send('Server Error');
  }
});

router.put('/unfollow/:id', auth, async (req, res) => {
  try {
    const followed_profile = await Profile.findById(req.params.id);

    const following_profile = await Profile.findOne({ user: req.user.id });

    //Provjeriti da li je post vec unlajkan od ovog usera
    if (
      followed_profile.followers.filter(follower => follower.id == req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'You arent following that user!' });
    }

    //Get remove index
    const removeIndex = following_profile.following
      .map(follower => follower.id.toString())
      .indexOf(followed_profile.user.toString());

    const removeIndex2 = followed_profile.followers
      .map(followed => followed.id.toString())
      .indexOf(req.user.id);

    following_profile.following.splice(removeIndex, 1);
    followed_profile.followers.splice(removeIndex2, 1);

    await followed_profile.save();
    await following_profile.save();

    res.json(followed_profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ne postoji taj profile' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
