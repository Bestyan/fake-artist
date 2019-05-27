import React, { PureComponent } from "react";
import * as communication from "../communication";
import * as GameConfig from "../../game/GameConfig";
import * as Constants from "../../Constants";
import PropTypes from "prop-types";

class VoteEvaluation extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isFetched: false,
      isDetected: false,
      fake: null, // only relevant if isDetected is true
      notDetectedBecause: null // only relevant if isDetected is false
    }
  }

  componentDidMount(){
    this.fetchEvaluation();
  }

  render() {
    if (this.state.isFetched) {

      return this.renderResult();

    } else {

      return this.renderFetchInProgress();

    }
  }

  renderResult = () => {

    if (this.state.isDetected) {

      return (
        <div>
          <p>The Fake has been detected!</p>
          <p>It was <strong>{this.state.fake.name}</strong>!</p>
          <p>They may now guess the term in order to win.</p>
        </div>
      );

    } else {

      return (
        <div>
          <p>The Fake could not be identified.</p>
          <p>Reason: {this.state.notDetectedBecause}</p>
        </div>
      );

    }
  }

  renderFetchInProgress = () => {
    return (
      <div>
        Fetching results...
      </div>
    );
  }

  fetchEvaluation = () => {
    communication.fetchEvaluation(
      json => {
        const isDetected = json[Constants.GET_FAKE_DETECTED_IS_DETECTED];
        const fake = json[Constants.GET_FAKE_DETECTED_FAKE_PLAYER];
        const notDetectedBecause = json[Constants.GET_FAKE_DETECTED_NOT_DETECTED_BECAUSE];

        this.setState({
          isFetched: true,
          isDetected: isDetected,
          fake: fake,
          notDetectedBecause: notDetectedBecause
        });

        setTimeout(this.props.advanceSubphase, GameConfig.DISPLAY_FAKE_DETECTION_TIME_MS);
      },
      error => {
        console.log(error);
        // retry
        setTimeout(this.fetchEvaluation, GameConfig.RETRY_TIMEOUT_MS);
      }
    )
  }
}

VoteEvaluation.propTypes = {
  advanceSubphase: PropTypes.func.isRequired,
  setDetected: PropTypes.func.isRequired,
  setFake: PropTypes.func.isRequired
};

export default VoteEvaluation;