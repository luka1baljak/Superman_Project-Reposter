import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Navbar = ({ auth: { user, isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        {user && (
          <Link to={`/profile/${user._id}`}>
            {user && (
              <img
                src={`/${user.avatar}`}
                alt=""
                className="round-img mala-slika"
              />
            )}
            &nbsp;Moj profil
          </Link>
        )}
      </li>
      <li>
        <Link to="/profiles">Korisnici</Link>
      </li>
      <li>
        <Link to="/posts">Glavni feed</Link>
      </li>
      <li>
        <Link to="/dashboard">Moj feed</Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt" />{" "}
          <span className="hide-sm">Odjavi se</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/posts">Glavni feed</Link>
      </li>
      <li>
        <Link to="/profiles">Korisnici</Link>
      </li>
      <li>
        <Link to="/register">Registriraj se</Link>
      </li>
      <li>
        <Link to="/login">Prijavi se</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-retweet" /> Reposter
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
