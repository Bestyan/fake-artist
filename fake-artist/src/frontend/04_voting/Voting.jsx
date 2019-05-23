import React, { PureComponent } from "react";
import * as Constants from "../../Constants";
import CastVote from "./CastVote";
import VoteInProgress from "./VoteInProgress";
import VoteFinished from "./VoteFinished";
import PropTypes from "prop-types";

class Voting extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      subphase: Constants.PHASE_VOTING_CAST_VOTE
    };
  }

  render() {
    switch (this.state.subphase) {

      case Constants.PHASE_VOTING_CAST_VOTE:
        return this.renderCastVote();

      case Constants.PHASE_VOTING_VOTE_IN_PROGRESS:
        return this.renderVoteInProgress();

      case Constants.PHASE_VOTING_VOTE_FINISHED:
        return this.renderVoteFinished();

      default:
        return <div>Unknown subphase in Voting.render(): {this.state.subphase}</div>;
    }
  }

  renderCastVote = () => {
    return (
      <CastVote
        advanceSubphase={this.advanceSubphase}
        players={this.props.players}
        player={this.props.player}
      />
    );
  };

  renderVoteInProgress = () => {
    return (
      <VoteInProgress
        advanceSubphase={this.advanceSubphase}
      />
    )
  };

  renderVoteFinished = () => {
    return (
      <VoteFinished
        advanceSubphase={this.advanceSubphase}
      />
    )
  };

  advanceSubphase = () => {
    const phaseOrder = Constants.PHASE_ORDER_VOTING;

    const nextPhaseIndex = phaseOrder.indexOf(this.state.subphase) + 1;

    if (nextPhaseIndex >= phaseOrder.length) {
      this.props.advancePhase();
      return;
    }

    const nextPhase = phaseOrder[nextPhaseIndex];

    console.log(`advancing to subphase '${nextPhase}'`)
    this.setState({
      subphase: nextPhase
    });
  };
}

Voting.propTypes = {
  advancePhase: PropTypes.func.isRequired,
  players: PropTypes.array.isRequired,
  player: PropTypes.object.isRequired
};

export default Voting;