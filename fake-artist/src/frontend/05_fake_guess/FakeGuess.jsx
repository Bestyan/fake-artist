import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import WaitForGuess from "./WaitForGuess";
import Guess from "./Guess";

class FakeGuess extends PureComponent {

  render() {
    switch (this.props.player.role) {

      case "artist":
      case "question-master":
        return this.renderWaitForGuess();

      case "fake":
        return this.renderFakeGuess();

      default:
        return <div>unknown role in FakeGuess.render()</div>;
    }
  }

  renderWaitForGuess = () => {
    return (
      <WaitForGuess 
        term={this.props.term}
        topic={this.props.topic}
        advancePhase={this.props.advancePhase}
      />
    );
  };

  renderFakeGuess = () => {
    return (
      <Guess 
        topic={this.props.topic}
        player={this.props.player}
        advancePhase={this.props.advancePhase}
      />
    );
  }

}

FakeGuess.propTypes = {
  player: PropTypes.object.isRequired,
  term: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  advancePhase: PropTypes.func.isRequired
};

export default FakeGuess;