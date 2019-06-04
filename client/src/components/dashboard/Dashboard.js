import React, { useEffect, Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import { getMyFeed } from '../../actions/post';
import PostItem from '../posts/PostItem';
import PostForm from '../posts/PostForm';
import InfiniteScroll from 'react-infinite-scroll-component';

const Dashboard = ({
  getCurrentProfile,
  getMyFeed,
  auth: { user, isAuthenticated, loading: auth_loading },
  profile: { profile, loading },
  post: { posts, len, loading: post_loading }
}) => {
  useEffect(() => {
    getCurrentProfile();
    getMyFeed(1, 5);
  }, [getCurrentProfile, getMyFeed]);

  const [page, setPage] = useState(2);
  const [perPage, setPerPage] = useState(5);
  const [moreExists, setMoreExists] = useState(true);

  const fetchPosts = () => {
    if (posts.length >= len) {
      setMoreExists(false);

      return;
    }

    getMyFeed(page, perPage);
    setPage(page + 1);
    setPerPage(5);
  };

  return auth_loading && loading && profile === null ? (
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
                <PostForm />
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
                  posts.map(post => <PostItem key={post._id} post={post} />)
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
  { getCurrentProfile, getMyFeed }
)(Dashboard);
