import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ChatPage from './ChatPage';

const JoinChat = ({ auth: { isAuthenticated, loading, user } }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [identified, setIdentified] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar);
    }
  }, [loading, user]);
  const handleNA = () => {
    setName(name);
    setIdentified(true);
  };

  const onChange = e => {
    setNewName(e.target.value);
  };

  const onSubmit = e => {
    e.preventDefault();
    setName(newName);
    setIdentified(true);
  };

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      {isAuthenticated ? (
        <Fragment>
          {!identified ? (
            <Fragment>
              <div className='center'>
                <h2 className='marginForAll'>
                  {' '}
                  Pridruži se grupnom Reposter Chattu{' '}
                </h2>
                <div className='form-group marginForAll'>
                  <button className='btn btn-problem' onClick={e => handleNA()}>
                    Sudjelujte kao{' '}
                    <img
                      src={`/${user.avatar}`}
                      alt=''
                      className='round-img mala-slika'
                    />{' '}
                    <span className='sender'>{user.name}</span> ?
                  </button>
                </div>

                <form className='form marginForAll' onSubmit={e => onSubmit(e)}>
                  <div className='form-group '>
                    <input
                      type='text'
                      placeholder='Izaberi nick'
                      name='name'
                      value={newName}
                      onChange={e => onChange(e)}
                    />
                  </div>
                  <div className='form-group marginForAll'>
                    <input
                      type='submit'
                      value='Sudjelujte sa nickom'
                      className='btn btn-problem my-1 '
                    />
                  </div>
                </form>
              </div>
            </Fragment>
          ) : (
            <ChatPage name={name} avatar={avatar} />
          )}
        </Fragment>
      ) : (
        <div>Prijavite se da biste mogli sudjelovati u chat</div>
      )}
    </Fragment>
  );
};

JoinChat.propTypes = { auth: PropTypes.object.isRequired };
const mapStatetoProps = state => ({
  auth: state.auth
});
export default connect(
  mapStatetoProps,
  {}
)(JoinChat);
