import React, { Component } from "react";
import PropTypes from "prop-types";
import AwaitTopic from "./AwaitTopic";
import DeclareTopic from "./DeclareTopic";

class PreDraw extends Component {

  render() {
    switch (this.props.player.role) {
      case "artist":
        return (
          <AwaitTopic
            theme={this.state.theme}
            player={this.props.player}
          />
        );
      case "question-master":
        return (
          <DeclareTopic
            topic={this.state.topic}
            setTopic={this.props.setTopic}
            setTerm={this.props.setTerm}
          />
        );
      default:
        return <p>Unknown player role in PreDraw.render(): '{this.props.player.role}'</p>
    }
  }
}

PreDraw.propTypes = {
  player: PropTypes.object.isRequired,
  advancePhase: PropTypes.func.isRequired,
  setTopic: PropTypes.func.isRequired,
  setTerm: PropTypes.func.isRequired
}

export default PreDraw;