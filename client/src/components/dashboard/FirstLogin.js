import React, { useEffect, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const Dashboard = ({
  getCurrentProfile,
  auth: { user, isAuthenticated },
  profile: { profile, loading }
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <Fragment>
      <Spinner />
    </Fragment>
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Postavi profil</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Dobrodošao {user && user.name} !
      </p>

      {profile !== null ? (
        <Fragment>
          <Redirect to='/dashboard' />
        </Fragment>
      ) : (
        <Fragment>
          <p>Molimo postavite vaš profil...</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Izradi Profil
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Dashboard);
