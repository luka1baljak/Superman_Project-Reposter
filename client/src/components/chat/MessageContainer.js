import React, { Component } from "react";
import Moment from "react-moment";
class MessagesContainer extends Component {
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: "smooth" });
  }
  render() {
    return (
      <div className="chatbox">
        {this.props.messages.map((message, index) => {
          return (
            <div key={"c" + index} className="onSmall">
              <p className="chat">
                <img
                  src={`/${message.avatar}`}
                  alt=""
                  className="round-img mala-slika"
                />{" "}
                <span className="sender">{message.sender}:</span>{" "}
                {message.content}
                <span className="timestamp">
                  Poslano u <Moment format="HH:mm">{message.timestamp}</Moment>
                </span>
              </p>
              <div
                ref={el => {
                  this.el = el;
                }}
              />
              <br />
            </div>
          );
        })}
      </div>
    );
  }
}

export default MessagesContainer;
