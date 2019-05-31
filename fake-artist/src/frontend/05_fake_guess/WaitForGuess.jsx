import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import * as GameConfig from "../../shared/GameConfig";
import * as communication from "../communication";
import * as Constants from "../../shared/Constants";

class WaitForGuess extends PureComponent {

  pollGuessInterval = null;

  constructor(props) {
    super(props);

    this.state = {
      guess: null,
      isCorrect: false,
      hasGuessedYet: false
    };
  }

  render() {

    if (this.state.hasGuessedYet) {

      return (
        <div>
          <p>The Fake has guessed: '{this.state.guess}'</p>
          <p>The term was: '{this.props.term}'</p>
        </div>
      );

    } else {

      return (
        <p>The Fake is trying to guess '{this.props.term}'</p>
      );

    }
  }

  componentDidMount() {
    this.startPolling();
  }

  componentWillUnmount() {
    this.stopPolling();
  }

  pollGuess = () => {
    communication.fetchGuess(
      json => {
        const hasGuessedYet = json[Constants.GET_GUESS_HAS_GUESSED];
        const guess = json[Constants.GET_GUESS_GUESS];
        const isCorrect = json[Constants.GET_GUESS_IS_CORRECT];

        this.setState({
          guess: guess,
          isCorrect: isCorrect,
          hasGuessedYet: hasGuessedYet
        });

        if (hasGuessedYet) {
          this.stopPolling();
          setTimeout(this.props.advancePhase, GameConfig.DISPLAY_GUESS_RESULTS_TIME_MS);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  startPolling = () => {
    if (this.pollGuessInterval === null) {
      this.pollGuessInterval = setInterval(this.pollGuess, GameConfig.POLLING_INTERVAL_MS);
    }
  }

  stopPolling = () => {
    clearInterval(this.pollGuessInterval);
    this.pollGuessInterval = null;
  }

}

WaitForGuess.propTypes = {
  term: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired
};

export default WaitForGuess;