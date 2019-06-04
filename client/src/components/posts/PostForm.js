import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addPost} from '../../actions/post';

const PostForm = ({ addPost }) => {
    const [text, setText] = useState('');
    const [privatno, setPrivatno]=useState(false);

    return (
        <div className="post-form">
        <div className="bg-primary p">
          <h3>Podijeli nešto sa nama!</h3>
        </div>
        <form className="form my-1" onSubmit={e => {
            e.preventDefault();
            addPost({ text,privatno });
            setText('');
        }}>
          <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Create a post"
            value={text}
            onChange={e => setText(e.target.value)}
            required
          ></textarea>
          <div>
          <input
            type="checkbox"
            name="privatno"
            checked={privatno}
            value={privatno}
            onChange={() => {
              setPrivatno( !privatno );
            }}
          />{" "}
          Želite li da ova objava bude privatna? <span className="upute">Privatne objave su vidljive samo na vašem profilu.</span>
          </div>
          <input type="submit" className="btn btn-dark my-1" value="Submit" />

          

        </form>
      </div>

    )
}

PostForm.propTypes = {
    addPost:PropTypes.func.isRequired
}

export default connect(null,{addPost})(PostForm);
