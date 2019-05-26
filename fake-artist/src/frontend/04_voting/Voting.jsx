import React, { PureComponent } from "react";
import * as Constants from "../../Constants";
import CastVote from "./CastVote";
import VoteInProgress from "./VoteInProgress";
import VoteFinished from "./VoteFinished";
import PropTypes from "prop-types";
import styled from "styled-components";

class Voting extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      subphase: Constants.PHASE_VOTING_CAST_VOTE
    };
  }

  render() {

    let subphaseRender = null;
    const picture = <CanvasImg src={this.props.picture} alt="your masterpiece"/>;

    switch (this.state.subphase) {

      case Constants.PHASE_VOTING_CAST_VOTE:
        subphaseRender = this.renderCastVote();
        break;

      case Constants.PHASE_VOTING_VOTE_IN_PROGRESS:
        subphaseRender = this.renderVoteInProgress();
        break;

      case Constants.PHASE_VOTING_VOTE_FINISHED:
        subphaseRender = this.renderVoteFinished();
        break;

      default:
        subphaseRender = <div>Unknown subphase in Voting.render(): {this.state.subphase}</div>;
    }

    return (
      <div>
        {picture}
        {subphaseRender}
      </div>
    );
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

// the img needs a white background because it is transparent
const CanvasImg = styled.img`
  background-color: white;
`;

Voting.propTypes = {
  advancePhase: PropTypes.func.isRequired,
  players: PropTypes.array.isRequired,
  player: PropTypes.object.isRequired,
  picture: PropTypes.string.isRequired
};

export default Voting;