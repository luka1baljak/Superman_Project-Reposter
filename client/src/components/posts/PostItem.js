import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import  Moment  from "react-moment";
import { connect } from "react-redux";
import { addLike, removeLike, deletePost } from '../../actions/post';
import YouTube from 'react-youtube'

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, avatar, user, likes, comments, date, ytlink},
  showActions
}) =>{ 
  const  _onReady = (e) => {
    e.target.pauseVideo();
  }
  
  return(
    <Fragment>
      {ytlink ? (<YouTube
        videoId={ytlink}
        onReady={(e) => _onReady(e)}
      />) : (<Fragment></Fragment>) }
      
  <div className="post bg-white p-1 my-1">
    <div>
      <Link to={`/profile/${user}`}>
        <img className="round-img" src={`/${avatar}`} alt="" />
        <h4>{name}</h4>
      </Link>
    </div>
    
    <div>
      <p className="my-1">{text}</p>
      <p class="post-date">
        Posted on <Moment format="DD/MM/YYYY">{date}</Moment>
      </p>
      <Fragment>{auth.isAuthenticated && showActions ? (<Fragment>
        <button onClick={e => addLike(_id)} type="button" className="btn btn-light">
        <i className="fas fa-thumbs-up" />
        {likes && likes.length>0 && <span>{likes.length}</span>}
        
      </button>

      <button onClick={e => removeLike(_id)} type="button" className="btn btn-light">
        <i className="fas fa-thumbs-down" />
        {likes && likes.length>0 && <span>{likes.length}</span>}
      </button>

      <Link to={`/post/${_id}`} className="btn btn-primary">
        Komentari 
        {comments && comments.length>0 && <span>{comments.length}</span>}
      </Link>
      {!auth.loading && user === auth.user._id && (
        <button onClick={e => deletePost(_id)} type="button" className="btn btn-danger">
          <i className="fas fa-times" />
        </button>
      )}
      </Fragment>) : (<div></div>)}</Fragment>

      
      
    </div>
  </div>
  </Fragment>
)};

PostItem.defaultProps = {
  showActions: true
}

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike:PropTypes.func.isRequired,
  removeLike:PropTypes.func.isRequired,
  deletePost:PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  {addLike, removeLike, deletePost}
)(PostItem);
