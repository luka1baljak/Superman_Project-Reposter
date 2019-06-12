import React, { useState, Fragment, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../actions/profile';
import { updateUser } from '../../actions/users';
import Spinner from '../layout/Spinner';

const EditProfile = ({
  profile: { profile, loading },
  auth: { user, loading: auth_loading },
  createProfile,
  updateUser,
  history,
  getCurrentProfile
}) => {
  const [userData, setUserData] = useState({
    name: '',
    avatar: null
  });
  const [formData, setFormData] = useState({
    datum_rodjenja: '',
    broj_telefona: '',
    lokacija: '',
    životni_moto: '',
    privatno: '',
    instagram: '',
    twitter: '',
    facebook: '',
    file: ''
  });
  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  useEffect(() => {
    getCurrentProfile();
    if (user) {
      setUserData({
        name: loading || !user.name ? '' : user.name
      });
    }
    if (profile) {
      setFormData({
        datum_rodjenja:
          loading || !profile.datum_rodjenja ? '' : profile.datum_rodjenja,
        broj_telefona:
          loading || !profile.broj_telefona ? '' : profile.broj_telefona,
        lokacija: loading || !profile.lokacija ? '' : profile.lokacija,
        životni_moto:
          loading || !profile.životni_moto ? '' : profile.životni_moto,
        privatno: loading || privatno === undefined ? '' : profile.privatno,
        instagram: loading || !profile.social ? '' : profile.social.instagram,
        twitter: loading || !profile.social ? '' : profile.social.twitter,
        facebook: loading || !profile.social ? '' : profile.social.facebook
      });
    }
  }, [loading, getCurrentProfile]);

  //Destruktuiranje
  const { name } = userData;

  const {
    datum_rodjenja,
    broj_telefona,
    lokacija,
    životni_moto,
    privatno,
    instagram,
    twitter,
    facebook,
    file
  } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    updateUser(userData);
    createProfile(formData, history, true);
  };

  const fileSelectedHandler = e => {
    setUserData({
      ...userData,
      avatar: e.target.files[0],
      file: URL.createObjectURL(e.target.files[0])
    });
    setFormData({
      ...formData,
      file: URL.createObjectURL(e.target.files[0])
    });
  };

  return loading || auth_loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Uredi svoj profil</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Podatci nisu obavezni.{' '}
        <span className='upute'>
          Samo potvrdite spremanje praznih podataka.
        </span>
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Ime i prezime'
            name='name'
            value={name}
            onChange={e =>
              setUserData({ ...userData, [e.target.name]: e.target.value })
            }
          />
        </div>

        <div>
          <div className='izbor-slike'>
            <input
              type='file'
              name='avatar'
              onChange={e => fileSelectedHandler(e)}
            />
          </div>
          {file && (
            <div>
              <img src={file} alt='' className='round-img med-slika' />
              <p>Pregled slike</p>
            </div>
          )}
        </div>

        <div className='form-group'>
          <input
            type='date'
            placeholder='Datum rođenja'
            name='datum_rodjenja'
            value={datum_rodjenja}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Broj telefona'
            name='broj_telefona'
            value={broj_telefona}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Lokacija'
            name='lokacija'
            value={lokacija}
            onChange={e => onChange(e)}
          />
        </div>

        <div className='form-group'>
          <textarea
            placeholder='Life quote'
            name='životni_moto'
            value={životni_moto}
            onChange={e => onChange(e)}
          />
        </div>

        <div className='form-group'>
          <input
            type='checkbox'
            name='privatno'
            checked={privatno}
            value={privatno}
            onChange={e => {
              setFormData({ ...formData, privatno: !privatno });
            }}
          />{' '}
          Želite li da vam profil bude privatan
        </div>

        <div className='my-2'>
          <button
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            type='button'
            className='btn btn-light'
          >
            Društvene mreže
          </button>
        </div>

        {displaySocialInputs && (
          <Fragment>
            <div className='form-group social-input'>
              <i className='fab fa-twitter fa-2x' />
              <input
                type='text'
                placeholder='Twitter URL'
                name='twitter'
                value={twitter}
                onChange={e => onChange(e)}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-facebook fa-2x' />
              <input
                type='text'
                placeholder='Facebook URL'
                name='facebook'
                value={facebook}
                onChange={e => onChange(e)}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-instagram fa-2x' />
              <input
                type='text'
                placeholder='Instagram URL'
                name='instagram'
                value={instagram}
                onChange={e => onChange(e)}
              />
            </div>
          </Fragment>
        )}

        <input type='submit' value='Spremi' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to={`/profile/${user._id}`}>
          Nazad
        </Link>
      </form>
    </Fragment>
  );
};

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile, updateUser }
)(withRouter(EditProfile));
