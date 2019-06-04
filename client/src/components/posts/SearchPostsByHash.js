import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getPosts, searchPosts } from '../../actions/post';
import PostItem from './PostItem';
import SearchBar from '../searchbar/SearchBar';
import InfiniteScroll from 'react-infinite-scroll-component';

const SearchPostsByHash = ({
  auth: { isAuthenticated, loading },
  searchPosts,
  match,
  post: { posts, len, loading: posts_loading }
}) => {
  useEffect(() => {
    searchPosts(match.params.keyWord);
  }, [searchPosts, match.params.keyWord]);
  const [page, setPage] = useState(2);
  const [perPage, setPerPage] = useState(5);
  const [moreExists, setMoreExists] = useState(true);

  const fetchPosts = () => {
    if (posts.length >= len) {
      setMoreExists(false);

      return;
    }

    getPosts(page, perPage);
    setPage(page + 1);
    setPerPage(5);
  };

  return loading && posts_loading ? (
    <Spinner />
  ) : (
    <div>
      <Fragment>
        <SearchBar holder='Upiši hash' fnc='posts' />
        <h1 className='large text-primary'>Pronađeni postovi</h1>
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
              <div />
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

SearchPostsByHash.propTypes = {
  searchPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  len: PropTypes.number
};
const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth,
  len: state.len
});

export default connect(
  mapStateToProps,
  { searchPosts }
)(SearchPostsByHash);
