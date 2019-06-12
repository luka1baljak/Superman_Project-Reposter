import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profile';
import { Link } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import DashboardActions from '../dashboard/DashboardActions';
import { addFollower, removeFollower } from '../../actions/profile';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostItem from '../posts/PostItem';
import { getUsersPosts } from '../../actions/post';

const Profile = ({
  addFollower,
  removeFollower,
  getProfileById,
  getUsersPosts,
  profile: { profile, loading },
  auth,
  post: { posts, len, loading: posts_load },
  match
}) => {
  const [offset, setOffset] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [moreExists, setMoreExists] = useState(true);

  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id, addFollower, removeFollower]);

  useEffect(() => {
    getUsersPosts(match.params.id, offset, perPage);
  }, [getUsersPosts, match.params.id, offset, perPage]);

  const fetchPosts = () => {
    if (posts.length >= len) {
      setMoreExists(false);
      return;
    }
    setOffset(offset + perPage);
    setPerPage(5);
  };
  const onRepost = () => {
    setOffset(offset + 6);
  };

  return (
    <Fragment>
      {posts_load || loading || auth.loading ? (
        <Spinner />
      ) : (
        <Fragment>
          {auth.isAuthenticated && profile === null ? (
            <Fragment>
              <p>Molimo postavite vaš profil...</p>
              <Link to='/create-profile' className='btn btn-primary my-1'>
                Izradi Profil
              </Link>
            </Fragment>
          ) : (
            <Fragment>
              <Link to='/profiles' className='btn btn-light'>
                Nazad
              </Link>
              {auth.isAuthenticated &&
              auth.loading === false &&
              loading === false ? (
                auth.user._id === profile.user._id ? (
                  <DashboardActions />
                ) : (
                  <Fragment>
                    {profile.followers.filter(
                      follower => follower._id.toString() === auth.user._id
                    ).length === 0 ? (
                      <Fragment>
                        <button
                          onClick={e => addFollower(profile._id)}
                          type='button'
                          className='btn btn-light'
                        >
                          <i className='fas fa-plus-circle text-primary' />
                          &nbsp; Prati Korisnika
                        </button>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <button
                          onClick={e => removeFollower(profile._id)}
                          type='button'
                          className='btn btn-light'
                        >
                          <i className='fas fa-minus-circle text-primary' />
                          &nbsp; Prestani pratiti Korisnika
                        </button>
                      </Fragment>
                    )}
                  </Fragment>
                )
              ) : (
                <Fragment>
                  <p className='lead'>
                    Logirajte se da biste mogli pratiti ovog usera
                  </p>
                </Fragment>
              )}
              <ProfileTop profile={profile} />
            </Fragment>
          )}
        </Fragment>
      )}
      {profile !== null && (
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchPosts}
          hasMore={moreExists}
          loader={<h4>Dohvaćanje postova</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Nema više za scrollati...</b>
            </p>
          }
        >
          {!posts_load && (
            <div className='posts'>
              {posts.length === 0 ? (
                <Fragment />
              ) : (
                posts.map(post => (
                  <PostItem key={post._id} post={post} onRepost={onRepost} />
                ))
              )}
            </div>
          )}
        </InfiniteScroll>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addFollower: PropTypes.func.isRequired,
  removeFollower: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  getUsersPosts: PropTypes.func.isRequired
};
const mapStatesToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  post: state.post
});

export default connect(
  mapStatesToProps,
  { getProfileById, addFollower, removeFollower, getUsersPosts }
)(Profile);
