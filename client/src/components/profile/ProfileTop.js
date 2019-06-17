import React from 'react';
import PropTypes from 'prop-types';
import FollowerItem from './FollowerItem';

const ProfileTop = ({
  profile: {
    user: { name, avatar },
    datum_rodjenja,
    broj_telefona,
    lokacija,
    životni_moto,
    followers,
    following,
    social
  }
}) => {
  return (
    <div className='profile-grid my-1'>
      <div className='profile-top bg-primary p-2'>
        <img className='round-img my-1' src={`/${avatar}`} alt='' />
        <h1 className='large'>{name}</h1>
        <p className='lead'>{životni_moto}</p>
        <p>{lokacija}</p>
        {social && (
          <div className='icons my-1'>
            {social.twitter && (
              <a
                href={social.twitter}
                target='_blank'
                rel='noopener noreferrer'
              >
                <i className='fab fa-twitter fa-2x' />
              </a>
            )}
            {social.facebook && (
              <a
                href={social.facebook}
                target='_blank'
                rel='noopener noreferrer'
              >
                <i className='fab fa-facebook fa-2x' />
              </a>
            )}
            {social.instagram && (
              <a
                href={social.instagram}
                target='_blank'
                rel='noopener noreferrer'
              >
                <i className='fab fa-instagram fa-2x' />
              </a>
            )}
          </div>
        )}
      </div>

      <div className='profile-about bg-light p-2'>
        <h2 className='text-primary'>Followers</h2>
        <div className='row'>
          {followers.map(follower => (
            <FollowerItem key={follower._id} follower={follower} />
          ))}
        </div>
        <div className='line' />
        <h2 className='text-primary'>Following</h2>
        <div className='row'>
          {following.map(follower => (
            <FollowerItem key={follower._id} follower={follower} />
          ))}
        </div>
      </div>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileTop;
