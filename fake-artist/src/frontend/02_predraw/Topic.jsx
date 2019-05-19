import React, { Component } from "react";
import PropTypes from "prop-types";
import * as communication from "../communication";
import * as Constants from "../../Constants";
import * as GameConfig from "../../game/GameConfig";

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
    if(event){
      event.preventDefault();
    }

    const topic = this.inputTopic.value;

    if (topic.length === 0) {
      return;
    }


    communication.declareTopic(
      topic,
      json => {
        if(json[Constants.RESPONSE_STATUS] === "fail"){
          console.log(json[Constants.RESPONSE_MESSAGE]);
          // TODO display error
        }

        this.props.setTopic(topic);
      },
      error => {
        console.log(error);
        // retry
        setTimeout(this.declareTopic, GameConfig.DECLARE_TOPIC_OR_TERM_TIMEOUT_MS);
      }
    );

    
  };
}

Topic.propTypes = {
  topic: PropTypes.string,
  setTopic: PropTypes.func.isRequired
}

export default Topic;