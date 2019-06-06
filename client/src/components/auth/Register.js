import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
import { useAlert } from 'react-alert';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    avatar: null,
    file: ''
  });
  const alert = useAlert();
  const { name, email, password, password2, avatar, file } = formData;

  const fileSelectedHandler = e => {
    if (e.target.files[0]) {
      setFormData({
        ...formData,
        avatar: e.target.files[0],
        file: URL.createObjectURL(e.target.files[0])
      });
      if (e.target.files[0].size > 1024 * 1024 * 5) {
        alert.show('Velicina slika ne smije preci 5mb');
      }
    }
  };

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ name, email, password, avatar });
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/firstlogin' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Registriraj se</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Izradi korisnički račun
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Ime i prezime'
            name='name'
            value={name}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='E-mail adresa'
            name='email'
            value={email}
            onChange={e => onChange(e)}
          />
          <small className='form-text' />
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
            type='password'
            placeholder='Lozinka'
            name='password'
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Ponovi Lozinku'
            name='password2'
            value={password2}
            onChange={e => onChange(e)}
          />
        </div>
        <input
          type='submit'
          className='btn btn-primary'
          value='Registriraj se'
        />
      </form>
      <p className='my-1'>
        Već imate korisnički račun? <Link to='/login'>Prijavite se!</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { setAlert, register }
)(Register);
