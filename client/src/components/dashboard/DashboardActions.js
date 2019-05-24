import React, {Fragment} from "react";
import { Link } from "react-router-dom";

const DashboardActions = () => {
  return (
    <Fragment>
      <div className="dash-buttons">
        <Link to="/edit-profile" className="btn btn-light">
          <i className="fas fa-user-circle text-primary" /> Edit Profile
        </Link>
      </div>
      </Fragment>
  );
};

export default DashboardActions;
