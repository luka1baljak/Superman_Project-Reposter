import React, { Component } from 'react';

class InputContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: ''
    };
  }

  render() {
    return (
      <form
        className='message'
        onSubmit={e => {
          e.preventDefault();
          this.handleSubmit();
        }}
      >
        <div>
          <input
            className='usermsg'
            placeholder='Upiši poruku...'
            value={this.state.content}
            onChange={e => {
              this.setState({ content: e.target.value });
            }}
            required
          />
        </div>
      </form>
    );
  }

  handleSubmit = () => {
    this.props.handleSubmit(this.state.content);
    this.setState({
      sender: '',
      content: ''
    });
  };
}

export default InputContainer;
