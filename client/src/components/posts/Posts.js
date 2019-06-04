import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getPosts, checkForNewPosts } from '../../actions/post';
import PostItem from './PostItem';
import PostForm from './PostForm';
import SearchBar from '../searchbar/SearchBar';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAlert } from 'react-alert';

const Posts = ({
  auth,
  getPosts,
  checkForNewPosts,
  post: { posts, len, lenAfterCheck, loading }
}) => {
  const alert = useAlert();
  useEffect(() => {
    getPosts(1, 5);
    setInterval(() => {
      checkForNewPosts();
    }, 10000);
  }, [getPosts, checkForNewPosts]);
  useEffect(() => {
    if (!loading && len > 6) {
      lenAfterCheck > len && alert.show('dodani su novi postovi');
    }
  }, [checkForNewPosts, len, lenAfterCheck, loading]);
  const [page, setPage] = useState(2);
  const [perPage, setPerPage] = useState(5);
  const [moreExists, setMoreExists] = useState(true);

  const fetchPosts = () => {
    if (posts.length >= len) {
      setMoreExists(false);

      return;
    }
    console.log('fetch posts fired with:page number', page);
    getPosts(page, perPage);
    setPage(page + 1);
    setPerPage(5);
  };

  return auth.loading || loading ? (
    <Spinner />
  ) : (
    <div>
      <Fragment>
        <SearchBar holder='Upiši hash' fnc='posts' />
        <h1 className='large text-primary'>Main Feed - postovi</h1>
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
            {auth.isAuthenticated ? (
              <PostForm />
            ) : (
              <Fragment>
                <p className='lead'>
                  Logirajte se da biste mogli lajkati ili komentirati
                </p>
              </Fragment>
            )}
          </Fragment>

          <div className='posts'>
            {posts.length === 0 ? (
              <Fragment />
            ) : (
              posts.map(post => <PostItem key={post._id} post={post} />)
            )}
          </div>
        </InfiniteScroll>
      </Fragment>
    </div>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  checkForNewPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  len: PropTypes.number,
  lenAfterCheck: PropTypes.number
};
const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth,
  len: state.len,
  lenAfterCheck: state.lenAfterCheck
});

export default connect(
  mapStateToProps,
  { getPosts, checkForNewPosts }
)(Posts);
