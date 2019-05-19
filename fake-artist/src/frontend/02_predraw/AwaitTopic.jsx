import React, { Component } from "react";
import * as Constants from "../../Constants.js";
import PropTypes from "prop-types";
import * as GameConfig from "../../game/GameConfig";
import * as communication from "../communication";

class AwaitTopic extends Component {

  pollTopicAndTermInterval = null;

  constructor(props) {
    super(props);

    this.state = {
      topic: null,
      term: null
    };
  }

  render() {

    const { topic, term } = this.state;

    return (
      <div>
        <p>The topic is {topic ? topic : "being chosen by the question master"}</p>
        <p>The term is {term ? term : "being chosen by the question master"}</p>
      </div>
    );

  }

  componentDidMount() {
    this.startPollingTopicAndTerm();
  }

  startPollingTopicAndTerm = () => {
    if (this.pollTopicAndTermInterval === null) {
      this.pollTopicAndTermInterval = setInterval(this.pollTopicAndTerm, GameConfig.POLLING_INTERVAL_MS);
    }
  }

  stopPollingTopicAndTerm = () => {
    clearInterval(this.pollTopicAndTermInterval);
    this.pollTopicAndTermInterval = null;
  }

  pollTopicAndTerm = () => {
    communication.pollTopicAndTerm(
      this.props.player.id,
      json => {
        if (json[Constants.RESPONSE_STATUS] === "fail") {
          console.log(json[Constants.RESPONSE_MESSAGE]);
          // TODO display error
          return;
        }

        const topic = json[Constants.POST_TOPIC_AND_TERM_TOPIC];
        const term = json[Constants.POST_TOPIC_AND_TERM_TERM];

        this.setState({
          topic: topic,
          term: term
        });

        if(topic && term){
          this.stopPollingTopicAndTerm();
          setTimeout(this.props.advanceSubphase, GameConfig.DISPLAY_TERM_TIME_MS);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}

AwaitTopic.propTypes = {
  setTopic: PropTypes.func.isRequired,
  setTerm: PropTypes.func.isRequired,
  player: PropTypes.object.isRequired,
  advanceSubphase: PropTypes.func.isRequired
}

export default AwaitTopic;