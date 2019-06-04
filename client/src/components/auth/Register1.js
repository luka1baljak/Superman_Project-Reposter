import React, { Fragment, Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import axios from "axios";
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
    CLEAR_PROFILE
  } from "../../actions/types";

export default class Register1 extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef(); // za avatar upload

    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      avatar: null
    };
  }

  validateForm() {
    return (
      this.state.name.length > 0 &&
      this.state.email.length > 0 &&
      this.state.password.length > 4 &&
      this.state.password === this.state.password2
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  handleSubmit = event => async dispatch => {
    event.preventDefault();

    const config = {
        headers: {
          "content-type": "application/json"
        }
      };
     
      const body = JSON.stringify( this.state.name, this.state.email, this.state.password );
    
      try {
        const res = await axios.post("/api/users", body, config);
    
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data
        });
    
        //dispatch(loadUser());
      } catch (err) {
        const errors = err.response.data.errors;
    
        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
    
        dispatch({
          type: REGISTER_FAIL
        });
      }
  };

  render() {
    return (
      <Fragment>
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead">
          <i className="fas fa-user" /> Create Your Account
        </p>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
            <small className="form-text" />
          </div>
          <input type="file" name="avatar" ref={this.fileInput} />

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              value={this.state.password2}
              onChange={this.handleChange}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </Fragment>
    );
  }
}