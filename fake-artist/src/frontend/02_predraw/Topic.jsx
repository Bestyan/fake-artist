import React, { Component } from "react";
import PropTypes from "prop-types";

class Topic extends Component {
  render() {
    return (
      <form onSubmit={this.declareTopic}>
        <p>Declare a Topic!</p>
        <input type="text" ref={input => this.inputTopic = input} />
        <button type="submit">go</button>
      </form>
    );
  }

  declareTopic = event => {

  };
}

export default Topic;