import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getProfiles } from '../../actions/profile';
import ProfileItem from './ProfileItem';
import SearchBar from '../searchbar/SearchBar';
import InfiniteScroll from 'react-infinite-scroll-component';

const Profiles = ({ getProfiles, profile: { profiles, loading, len } }) => {
  useEffect(() => {
    getProfiles(1, 2);
  }, [getProfiles]);

  const [page, setPage] = useState(2);
  const [perPage, setPerPage] = useState(2);
  const [moreExists, setMoreExists] = useState(true);

  const fetchProfiles = () => {
    if (profiles.length >= len) {
      setMoreExists(false);
      return;
    }
    getProfiles(page, perPage);
    setPage(page + 1);
    setPerPage(2);
  };

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <SearchBar holder='Upiši ime' fnc='profiles' />
          <h1 className='large text-primary'>Profili</h1>
          <p className='lead'>Tko nam se pridružio?</p>
          <InfiniteScroll
            dataLength={profiles.length}
            next={fetchProfiles}
            hasMore={moreExists}
            loader={<h4>Dohvaćanje profila</h4>}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Nema više za scrollati...</b>
              </p>
            }
          >
            <div className='profiles'>
              {profiles.length > 0 ? (
                profiles.map(profile => (
                  <ProfileItem key={profile._id} profile={profile} />
                ))
              ) : (
                <h4>Nema profila za prikazati</h4>
              )}
            </div>
          </InfiniteScroll>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  len: PropTypes.number
};
const mapStateToProps = state => ({
  profile: state.profile,
  len: state.len
});
export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
