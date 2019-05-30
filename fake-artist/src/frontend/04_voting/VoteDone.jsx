import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import PlayerVoteResult from "./PlayerVoteResult";
import * as communication from "../communication";
import * as GameConfig from "../../shared/GameConfig";

class VoteDone extends PureComponent {

  fetchVotesInterval = null;

  constructor(props) {
    super(props);

    /*
    state = {
      result: [
        {
          player: {id, name, color},
          votes: 0
        }
      ],
      finished: false
    }
    */
    this.state = {
      result: [],
      finished: false
    }
  }

  componentDidMount() {
    this.startFetching();
  }

  componentWillUnmount() {
    this.stopFetching();
  }

  fetchResults = () => {
    communication.fetchVotes(
      json => {
        // returned json matches the state object
        this.setState(json);

        if (this.state.finished) {
          this.stopFetching();
          setTimeout(this.props.advanceSubphase, GameConfig.DISPLAY_VOTE_RESULTS_TIME_MS);
        }

      },
      error => {
        console.log(error);
      });
  };

  startFetching = () => {
    if (this.fetchVotesInterval === null) {
      this.fetchVotesInterval = setInterval(this.fetchResults, GameConfig.POLLING_INTERVAL_MS);
    }
  };

  stopFetching = () => {
    clearInterval(this.fetchVotesInterval);
    this.fetchVotesInterval = null;
  };

  render() {
    const results = this.state.result.map(playerResult => {
      return <PlayerVoteResult
        result={playerResult}
        key={playerResult.player.id}
      />
    });

    return (
      <div>
        <p>{this.state.finished ? "everyone voted" : "voting in progress..."}</p>
        <ul>
          {results}
        </ul>
      </div>
    );
  }
}

VoteDone.propTypes = {
  advanceSubphase: PropTypes.func.isRequired
};

export default VoteDone;