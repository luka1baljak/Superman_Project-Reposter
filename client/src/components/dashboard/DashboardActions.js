import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const DashboardActions = () => {
  return (
    <Fragment>
      <Link to="/edit-profile" className="btn btn-light">
        <i className="fas fa-user-circle text-primary" /> Uredite Profil
      </Link>
    </Fragment>
  );
};

export default DashboardActions;
