import React, { Component } from 'react';
import MessagesContainer from './MessageContainer';
import InputContainer from './InputContainer';
import openSocket from 'socket.io-client';

class ChatPage extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      socket: openSocket('http://localhost:5000/chatty')
    };

    this.state.socket.on('new-message', message => {
      let currentMessages = this.state.messages;
      currentMessages.push(message);
      this.setState({
        messages: currentMessages
      });
    });
  }

  componentDidMount() {
    this._isMounted = true;
    fetch('http://localhost:5000/api/message', {
      method: 'GET'
    })
      .then(res => {
        return res.json();
      })
      .then(resJson => {
        if (this._isMounted) {
          this.setState({
            messages: resJson
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className='wrapper'>
        <div className='menu'>
          <p className='welcome'>
            Dobrodošli u Reposter Chat room <b />
          </p>
        </div>

        {this.state.messages.length > 0 ? (
          <MessagesContainer messages={this.state.messages} />
        ) : (
          <div className='chatbox' />
        )}

        <InputContainer handleSubmit={this.handleSubmit} />
      </div>
    );
  }

  handleSubmit = content => {
    let reqBody = {
      sender: this.props.name,
      content: content,
      avatar: this.props.avatar
    };

    fetch('http://localhost:5000/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    })
      .then(res => {
        return res.json();
      })
      .then(resJson => {
        this.state.socket.emit('new-message', resJson);
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export default ChatPage;
