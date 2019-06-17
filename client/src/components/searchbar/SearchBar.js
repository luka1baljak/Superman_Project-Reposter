import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchPosts } from '../../actions/post';
import { searchProfiles } from '../../actions/profile';
const SearchBar = ({ onSearch, searchProfiles, searchPosts, holder, fnc }) => {
  const [search, setSearch] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    onSearch();
    switch (fnc) {
      case 'posts':
        searchPosts(search);
        break;
      case 'profiles':
        searchProfiles(search);
        break;
      default:
        break;
    }
    setSearch('');
  };
  return (
    <Fragment>
      <div className='search'>
        <form className='search-form' onSubmit={e => onSubmit(e)}>
          <input
            type='search'
            onChange={e => setSearch(e.target.value)}
            value={search}
            placeholder={holder}
            name='q'
          />
          <input type='submit' value='Traži' />
        </form>
      </div>
    </Fragment>
  );
};

SearchBar.propTypes = {
  searchPosts: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  posts: state.posts,
  profiles: state.profiles
});
export default connect(
  mapStateToProps,
  { searchPosts, searchProfiles }
)(SearchBar);
