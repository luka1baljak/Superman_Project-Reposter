import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const FollowerItem = ({ follower }) => {
  return (
    <div className='column'>
      <Link to={`/profile/${follower._id}`}>
        <img alt='' className='round-img my-1 sz' src={`/${follower.avatar}`} />
      </Link>
    </div>
  );
};

FollowerItem.defaultProps = {
  showActions: true
};

FollowerItem.propTypes = {
  follower: PropTypes.object.isRequired
};
/*const mapStateToProps = state => ({
 
});*/
export default connect(
  null,
  {}
)(FollowerItem);
