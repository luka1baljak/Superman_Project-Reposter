import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { user, isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/join'>
          <i className='fawes far fa-comments' />{' '}
          <span className='hide-sm'>Chat</span>
        </Link>
      </li>
      <li>
        {user && (
          <Link to={`/profile/${user._id}`}>
            {user && (
              <img
                src={`/${user.avatar}`}
                alt=''
                className='round-img mala-slika'
              />
            )}{' '}
            <span className='hide-sm'>Moj profil</span>
          </Link>
        )}
      </li>
      <li>
        <Link to='/profiles'>
          <i className='fawes fas fa-users' />{' '}
          <span className='hide-sm'>Korisnici</span>
        </Link>
      </li>
      <li>
        <Link to='/posts'>
          <i className='fawes fas fa-newspaper' />{' '}
          <span className='hide-sm'>Glavni Feed</span>
        </Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <i className='fawes far fa-newspaper' />{' '}
          <span className='hide-sm'>Moj Feed</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href='#!'>
          <i className='fawes fas fa-sign-out-alt' />{' '}
          <span className='hide-sm'>Odjavi se</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to='/posts'>
          <i className='fawes fas fa-newspaper' />{' '}
          <span className='hide-sm'>Glavni feed</span>
        </Link>
      </li>
      <li>
        <Link to='/profiles'>
          <i className='fawes fas fa-users' />{' '}
          <span className='hide-sm'>Korisnici</span>
        </Link>
      </li>
      <li>
        <Link to='/register'>
          <i className='fawes fas fa-user-plus' />{' '}
          <span className='hide-sm'>Registriraj se</span>
        </Link>
      </li>
      <li>
        <Link to='/login'>
          <i className='fawes fas fa-user' />{' '}
          <span className='hide-sm'>Prijavi se</span>
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-retweet' /> Reposter
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStatetoProps = state => ({
  auth: state.auth
});

export default connect(
  mapStatetoProps,
  { logout }
)(Navbar);
