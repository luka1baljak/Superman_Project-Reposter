import React from "react";
import PropTypes from "prop-types";
import  Moment  from "react-moment";

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
    <div class="profile-top bg-primary p-2">
      <img src={`/${avatar}`} alt="" className="round-img" />
      <h1 class="large">{name}</h1>
      <p class="lead">Moto:{životni_moto}</p>
      <p class="lead">Datum rodjenja:<Moment format="DD/MM/YYYY">{datum_rodjenja}</Moment></p>
      <p class="lead">Telefon:{broj_telefona}</p>
      <p class="lead">Lokacija:{lokacija}</p>

      {social && (
        <div class="icons my-1">
          {social.twitter && (
            <a href={social.twitter} target="_blank" rel="noopener noreferrer">
              <i class="fab fa-twitter fa-2x" />
            </a>
          )}
          {social.facebook && (
            <a href={social.facebook} target="_blank" rel="noopener noreferrer">
              <i class="fab fa-facebook fa-2x" />
            </a>
          )}
          {social.instagram && (
            <a
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i class="fab fa-instagram fa-2x" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileTop;
