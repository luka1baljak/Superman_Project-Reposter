import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { addPost, addLike, removeLike, deletePost } from '../../actions/post';
import Autolinker from 'autolinker';
import DOMPurify from 'dompurify';
import ReactPlayer from 'react-player';

const PostItem = ({
  addPost,
  addLike,
  removeLike,
  deletePost,
  auth,
  post: {
    _id,
    text,
    name,
    avatar,
    user,
    likes,
    comments,
    date,
    ytlink,
    imglink
  },
  showActions
}) => {
  const arr = text
    .split(' ')
    .map(rijec =>
      rijec.indexOf('#') === 0
        ? `<a href=/searchPosts/${
            rijec.indexOf('.') === rijec.length - 1 ||
            rijec.indexOf(',') === rijec.length - 1
              ? rijec.substring(1, rijec.length - 1)
              : rijec.substring(1)
          }>${rijec}</a>`
        : rijec
    );
  const textWithHashLinks = arr.join(' ');
  var autolinker = new Autolinker({
    urls: {
      schemeMatches: true,
      wwwMatches: true,
      tldMatches: true
    },
    email: true,
    phone: true,
    mention: false,
    hashtag: false,

    stripPrefix: true,
    stripTrailingSlash: true,
    newWindow: true,

    truncate: {
      length: 0,
      location: 'end'
    },

    className: ''
  });

  var linkedText = autolinker.link(textWithHashLinks);

  return (
    <Fragment>
      {ytlink ? (
        <ReactPlayer url={ytlink} width='50%' height='300px' />
      ) : imglink ? (
        <img
          className='imglink-size'
          src={imglink}
          alt='Ovo je slika od proslijeđenog linka'
        />
      ) : (
        <Fragment />
      )}

      <div className='post bg-white p-1 my-1'>
        <div>
          <Link to={`/profile/${user}`}>
            <img className='round-img' src={`/${avatar}`} alt='' />
            <h4>{name}</h4>
          </Link>
        </div>

        <div>
          <div
            className='content'
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(linkedText)
            }}
          />

          <p className='post-date'>
            Posted on <Moment format='DD/MM/YYYY'>{date}</Moment>
          </p>
          <Fragment>
            {auth.isAuthenticated && showActions ? (
              <Fragment>
                <button className='btn btn-light'>
                  {likes && likes.length > 0 ? (
                    <span>&nbsp;{likes.length}</span>
                  ) : (
                    <span>0</span>
                  )}
                </button>
                {likes.filter(like => like.user.toString() === auth.user._id)
                  .length > 0 ? (
                  <button
                    onClick={e => removeLike(_id)}
                    type='button'
                    className='btn btn-light'
                  >
                    <i className='fas fa-thumbs-up boja-prsta' />
                  </button>
                ) : (
                  <button
                    onClick={e => addLike(_id)}
                    type='button'
                    className='btn btn-light'
                  >
                    <i className='fas fa-thumbs-up' />
                  </button>
                )}
                <Link to={`/post/${_id}`} className='btn btn-primary'>
                  Komentari
                  {comments && comments.length > 0 && (
                    <span>&nbsp;{comments.length}</span>
                  )}
                </Link>
                {auth.user && !auth.loading && user === auth.user._id ? (
                  <button
                    onClick={e => deletePost(_id)}
                    type='button'
                    className='btn btn-danger'
                  >
                    <i className='fas fa-times' />
                  </button>
                ) : (
                  <button
                    onClick={e => addPost({ text })}
                    type='button'
                    className='btn btn-success'
                  >
                    <i className='fas fa-retweet' />
                  </button>
                )}
              </Fragment>
            ) : (
              <div />
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addPost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  searchPosts: PropTypes.func
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { addPost, addLike, removeLike, deletePost }
)(PostItem);
