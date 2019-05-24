import React, {Fragment,useEffect} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import {getProfileById} from '../../actions/profile';
import {Link} from 'react-router-dom';
import ProfileTop from './ProfileTop';
import DashboardActions from '../dashboard/DashboardActions';

const Profile = ({ getProfileById, profile: {profile,loading},auth, match }) => {
    useEffect(() => {
        getProfileById(match.params.id );
    },[getProfileById, match.params.id]);

    return (
        <Fragment>
            
            {profile === null || loading ? (
            <Spinner />
            ) : (
            <Fragment>
                <Link to='/profiles' className='btn btn-light'>
                    Nazad 
                </Link>

                <Fragment>{auth.isAuthenticated ? (
                    <Fragment>
                        <Link to="/follow" className="btn btn-light">
                            Follow
                        </Link>
                        <Link to="/unfollow" className="btn btn-light">
                            UnFollow
                        </Link>
                    </Fragment>) 
                    : (<Fragment>
                        <p className="lead">
                            Logirajte se da biste mogli pratiti ovog usera
                        </p>
                    </Fragment>)}</Fragment>

                
                

                    <div className="profile-grid my-1">
                        <ProfileTop profile={profile} />
                        {auth.isAuthenticated && auth.loading === false && auth.user._id === 
                        profile.user._id && (
                    <   DashboardActions />
                        )}
                    </div>
            </Fragment>
            )} 
        </Fragment>
    );
};

Profile.propTypes = {
    getProfileById:PropTypes.func.isRequired,
    profile:PropTypes.object.isRequired,
    auth:PropTypes.object.isRequired
}
const mapStatesToProps = state => ({
    profile:state.profile,
    auth: state.auth
})

export default connect(mapStatesToProps, { getProfileById })(Profile);
