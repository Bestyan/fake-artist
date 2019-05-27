import React, { PureComponent } from "react";
import * as communication from "../communication";
import * as GameConfig from "../../game/GameConfig";
import PropTypes from "prop-types";
import * as Constants from "../../Constants";

class Guess extends PureComponent {

  inputGuess = null;

  constructor(props) {
    super(props);

    this.state = {
      guess: null,
      term: null,
      isCorrect: false
    };
  }

  render() {
    if (this.state.term === null) {

      return this.renderGuess();

    } else {

      return this.renderResult();

    }
  }

  renderGuess = () => {
    return (
      <form onSubmit={this.submitGuess}>
        <p>You have been identified.</p>
        <p>You can still win by guessing the term on the topic of {this.props.topic}</p>
        <input type="text" ref={input => this.inputGuess = input} />
        <button type="submit">guess</button>
      </form>
    );
  };

  renderResult = () => {
    return (
      <div>
        <p>You {this.state.isCorrect ? "guessed" : "did not guess"} correctly!</p>
        <p>You guessed: {this.state.guess}</p>
        <p>The solution was: {this.state.term} from the topic {this.props.topic}</p>
      </div>
    );
  }

  submitGuess = event => {
    if (event) {
      event.preventDefault();
    }

    const guess = this.inputGuess.value;
    if (guess.length <= 0) {
      return;
    }

    communication.submitGuess(
      guess,
      this.props.player.id,
      json => {

        if(json[Constants.RESPONSE_STATUS] === "fail"){
          // TODO: display error
          console.log(json[Constants.RESPONSE_MESSAGE]);
          return;
        }

        const term = json[Constants.PUT_GUESS_TERM];
        const isCorrect = json[Constants.PUT_GUESS_IS_CORRECT];

        this.setState({
          guess: guess,
          term: term,
          isCorrect: isCorrect
        });
      },

      error => {
        console.log(error);
        // retry
        setTimeout(this.submitGuess, GameConfig.RETRY_TIMEOUT_MS);
      }
      
    )
  };
}

Guess.propTypes = {
  topic: PropTypes.string.isRequired,
  player: PropTypes.object.isRequired
}

export default Guess;