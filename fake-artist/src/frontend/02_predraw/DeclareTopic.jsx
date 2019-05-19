import React, { Component } from "react";
import PropTypes from "prop-types";
import Term from "./Term";
import Topic from "./Topic";

class DeclareTopic extends Component {

  constructor(props) {
    super(props);

    this.state = {
      topic: null,
      term: null
    }
  }

  render() {
    let term = "";
    if (this.state.topic !== null) {
      term = (
        <Term
          topic={this.state.topic}
          term={this.state.term}
          setTerm={this.setTerm}
          advanceSubphase={this.props.advanceSubphase}
        />
      );
    }

    return (
      <div>
        <Topic
          topic={this.state.topic}
          setTopic={this.setTopic}
        />
        {term}
      </div>
    );
  }

  setTopic = topic => {
    this.props.setTopic(topic);
    this.setState({
      topic: topic
    });
  }

  setTerm = term => {
    this.props.setTerm(term);
    this.setState({
      term: term
    });
  }

}

DeclareTopic.propTypes = {
  topic: PropTypes.string,
  setTopic: PropTypes.func.isRequired,
  setTerm: PropTypes.func.isRequired,
  player: PropTypes.object.isRequired,
  advanceSubphase: PropTypes.func.isRequired
};

export default DeclareTopic;