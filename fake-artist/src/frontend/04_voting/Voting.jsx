import React, { PureComponent } from "react";
import * as Constants from "../../Constants";
import CastVote from "./CastVote";
import VoteDone from "./VoteDone";
import PropTypes from "prop-types";
import styled from "styled-components";
import VoteEvaluation from "./VoteEvaluation";

class Voting extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      subphase: Constants.PHASE_VOTING_CAST_VOTE
    };
  }

  render() {

    let subphaseRender = null;
    const picture = <CanvasImg src={this.props.picture} alt="your masterpiece" />;

    switch (this.state.subphase) {

      case Constants.PHASE_VOTING_CAST_VOTE:
        subphaseRender = this.renderCastVote();
        break;

      case Constants.PHASE_VOTING_VOTE_DONE:
        subphaseRender = this.renderVoteDone();
        break;

      case Constants.PHASE_VOTING_EVALUATION:
        subphaseRender = this.renderEvaluation();
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

  renderVoteDone = () => {
    return (
      <VoteDone
        advanceSubphase={this.advanceSubphase}
      />
    )
  };

  renderEvaluation = () => {
    return (
      <VoteEvaluation
        advanceSubphase={this.advanceSubphase}
        setDetected={this.props.setDetected}
        setFake={this.props.setFake}
      />
    );
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
  picture: PropTypes.string.isRequired,
  setDetected: PropTypes.func.isRequired,
  setFake: PropTypes.func.isRequired
};

export default Voting;