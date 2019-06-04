import React, { Fragment, Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { login } from '../../actions/auth';

export default class Login1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 4;
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    login(this.state.email, this.state.password);
    return <Redirect to='/firstlogin' />;
  };

  render() {
    return (
      <Fragment>
        <h1 className='large text-primary'>Sign In</h1>
        <p className='lead'>
          <i className='fas fa-user' /> Sign Into Your Account
        </p>
        <form className='form' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              value={this.state.password}
              onChange={this.handleChange}
              minLength='4'
            />
          </div>
          <input type='submit' className='btn btn-primary' value='Login' />
        </form>
        <p className='my-1'>
          Don't have an account? <Link to='/register'>Sign Up</Link>
        </p>
      </Fragment>
    );
  }
}
