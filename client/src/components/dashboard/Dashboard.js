import React, { useEffect, Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import { getMyFeed, checkForNewPostsFeed } from '../../actions/post';
import PostItem from '../posts/PostItem';
import PostForm from '../posts/PostForm';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAlert } from 'react-alert';

const Dashboard = ({
  getCurrentProfile,
  checkForNewPostsFeed,
  getMyFeed,
  auth: { user, isAuthenticated, loading: auth_loading },
  profile: { profile, loading },
  post: { posts, len, loading: post_loading, lenAfterCheck }
}) => {
  const alert = useAlert();
  const [offset, setOffset] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [moreExists, setMoreExists] = useState(true);

  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  useEffect(() => {
    getMyFeed(offset, perPage);
  }, [getMyFeed, offset, perPage]);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForNewPostsFeed();
    }, 10000);
    return () => clearInterval(timer);
  }, [checkForNewPostsFeed]);

  useEffect(() => {
    if (!post_loading) {
      lenAfterCheck > len && alert.show('dodani su novi postovi');
    }
  }, [checkForNewPostsFeed, len, lenAfterCheck, post_loading]);

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

  return auth_loading || loading || post_loading ? (
    <Fragment>
      <Spinner />
    </Fragment>
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Moj Feed</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Dobrodošao {user && user.name} !
      </p>

      {profile !== null ? (
        <Fragment>
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
            <Fragment>
              {isAuthenticated ? (
                <PostForm onRepost={onRepost} />
              ) : (
                <Fragment>
                  <p className='lead'>
                    Logirajte se da biste mogli lajkati ili komentirati
                  </p>
                </Fragment>
              )}
            </Fragment>
            {!post_loading && (
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
  checkForNewPostsFeed: PropTypes.func.isRequired,
  getMyFeed: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  len: PropTypes.number
};

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth,
  profile: state.profile,
  len: state.len
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, getMyFeed, checkForNewPostsFeed }
)(Dashboard);
