import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    datum_rodjenja,
    broj_telefona,
    lokacija,
    životni_moto,
    followers,
    following
  }
}) => {
  return (
    <div className='profile bg-light'>
      <img src={avatar} alt='' className='round-img' />
      <div>
        <h2>{name}</h2>
        <p>{životni_moto}</p>
        <br />
        <hr />
        <br />
        <Link to={`/profile/${_id}`} className='btn btn-primary'>
          Profil
        </Link>
      </div>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
