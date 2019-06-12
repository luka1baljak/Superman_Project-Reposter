import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { searchPosts } from '../../actions/post';
import PostItem from './PostItem';
import SearchBar from '../searchbar/SearchBar';

const SearchPostsByHash = ({
  auth: { isAuthenticated, loading },
  searchPosts,
  match,
  post: { posts, loading: posts_loading }
}) => {
  useEffect(() => {
    searchPosts(match.params.keyWord);
  }, [searchPosts, match.params.keyWord]);

  const onRepost = () => {
    searchPosts(match.params.keyWord);
  };

  return loading && posts_loading ? (
    <Spinner />
  ) : (
    <div>
      <Fragment>
        <SearchBar holder='Upiši hash' fnc='posts' />
        <h1 className='large text-primary'>Pronađeni postovi</h1>
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
            posts.map(post => (
              <PostItem key={post._id} post={post} onRepost={onRepost} />
            ))
          )}
        </div>
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
