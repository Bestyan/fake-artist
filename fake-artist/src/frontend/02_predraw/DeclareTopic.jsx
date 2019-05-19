import React, { Component } from "react";
import PropTypes from "prop-types";
import Term from "./Term";
import Topic from "./Topic";

class DeclareTheme extends Component {

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
      term = <Term
        setTerm={term => this.setState({ term: term })}
      />;
    }

    return (
      <div>
        <Topic
          topic={this.props.topic}
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

}

DeclareTheme.propTypes = {
  topic: PropTypes.string.isRequired,
  setTopic: PropTypes.func.isRequired
};

export default DeclareTheme;