import React, { PureComponent } from "react";
import * as Constants from "../../shared/Constants";
import CastVote from "./CastVote";
import VoteDone from "./VoteDone";
import PropTypes from "prop-types";
import VoteEvaluation from "./VoteEvaluation";
import {CanvasImg} from "../components/Components";

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
        advanceToGuessPhase={this.advanceSubphase}
        advanceToSummary={this.props.advanceToSummary}
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

Voting.propTypes = {
  advancePhase: PropTypes.func.isRequired,
  players: PropTypes.array.isRequired,
  player: PropTypes.object.isRequired,
  picture: PropTypes.string.isRequired,
  setDetected: PropTypes.func.isRequired,
  setFake: PropTypes.func.isRequired,
  advanceToSummary: PropTypes.func.isRequired
};

export default Voting;