import React, { Component } from "react";
import PropTypes from "prop-types";

class Topic extends Component {

  inputTopic = null;

  render() {
    if (this.props.topic !== null) {

      return (
        <div>The topic is <strong>{this.props.topic}</strong>!</div>
      )

    } else {

      return (
        <form onSubmit={this.declareTopic}>
          <p>Declare a Topic!</p>
          <input type="text" ref={input => this.inputTopic = input} />
          <button type="submit">go</button>
        </form>
      );

    }
  }

  declareTopic = event => {
    event.preventDefault();

    if (this.inputTopic.value.length === 0) {
      return;
    }

    const topic = this.inputTopic.value;

    
  };
}

Topic.propTypes = {
  topic: PropTypes.string.isRequired,
  setTopic: PropTypes.func.isRequired
}

export default Topic;