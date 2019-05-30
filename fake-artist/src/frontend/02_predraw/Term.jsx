import React, { Component } from "react";
import PropTypes from "prop-types";
import * as communication from "../communication";
import * as Constants from "../../Constants";
import * as GameConfig from "../../shared/GameConfig";

class Term extends Component {

  inputTerm = null;

  render() {
    if (this.props.term === null) {

      return (
        <form onSubmit={this.declareTerm}>
          <p>Declare a term on the topic of {this.props.topic}</p>
          <input type="text" ref={input => this.inputTerm = input} />
          <button type="submit">go</button>
        </form>
      );

    } else {

      return <div>The term is <strong>{this.props.term}</strong>!</div>;

    }

  }

  declareTerm = event => {
    if (event) {
      event.preventDefault();
    }

    const term = this.inputTerm.value;

    if (term.length === 0) {
      return;
    }

    communication.declareTerm(
      term,
      json => {
        if (json[Constants.RESPONSE_STATUS] === "fail") {
          console.log(json[Constants.RESPONSE_MESSAGE]);
          // TODO display error
          return;
        }

        this.props.setTerm(term);
        setTimeout(this.props.advanceSubphase, GameConfig.DISPLAY_TERM_TIME_MS);
      },
      error => {
        console.log(error);
        // retry
        setTimeout(this.declareTerm, GameConfig.DECLARE_TOPIC_TIMEOUT_MS);
      }
    );
  }

}

Term.propTypes = {
  term: PropTypes.string,
  topic: PropTypes.string.isRequired,
  setTerm: PropTypes.func.isRequired,
  advanceSubphase: PropTypes.func.isRequired
};

export default Term;