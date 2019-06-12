import React, { Component } from 'react';
import Moment from 'react-moment';
class MessagesContainer extends Component {
  render() {
    return (
      <div className='chatbox'>
        {this.props.messages.map((message, index) => {
          return (
            <div key={'c' + index}>
              <p className='chat'>
                <img
                  src={`/${message.avatar}`}
                  alt=''
                  className='round-img mala-slika'
                />{' '}
                <span className='sender'>{message.sender}:</span>{' '}
                {message.content}
              </p>

              <p className='timestamp'>
                Poslano u <Moment format='HH:mm'>{message.timestamp}</Moment>
              </p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default MessagesContainer;
