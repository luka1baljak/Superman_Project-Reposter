import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getPosts } from "../../actions/post";
import PostItem from "./PostItem";
import PostForm from "./PostForm";

const Posts = ({ auth: { isAuthenticated, loading },getPosts, post: { posts } }) => {
  useEffect(() => {
    
    getPosts();
    
    
  }, [getPosts]);
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Main Feed - postovi</h1>
      
      <Fragment>{isAuthenticated ? <PostForm /> : <Fragment>
        <p className="lead">
        Logirajte se da biste mogli lajkati ili komentirati
      </p>
        </Fragment>}</Fragment>
      
      <div className="posts">
        {posts.map(post => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth:PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  post: state.post,
  auth:state.auth
});

export default connect(
  mapStateToProps,
  { getPosts }
)(Posts);
