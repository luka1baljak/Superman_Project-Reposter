import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">Profili</Link>
      </li>
      <li>
        <Link to="/posts">Main feed</Link>
      </li>
      <li>
        <Link to="/dashboard">
          My feed
        </Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt" />{" "}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
<<<<<<< Updated upstream
        <Link to="/posts">Main feed</Link>
      </li>
      <li>
        <Link to="/profiles">Profili</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
=======
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
>>>>>>> Stashed changes
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-retweet" /> The Art Of Repost
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
