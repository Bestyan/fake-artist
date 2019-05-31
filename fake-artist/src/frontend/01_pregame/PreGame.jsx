import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import * as Constants from "../../shared/Constants";
import ChooseName from "./ChooseName";
import AwaitingGameStart from "./AwaitingGameStart";

class PreGame extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      subphase: Constants.PHASE_PRE_GAME_CHOOSE_NAME
    }
  }

  render() {
    switch (this.state.subphase) {
      case Constants.PHASE_PRE_GAME_CHOOSE_NAME:
        return this.renderChooseName();

      case Constants.PHASE_PRE_GAME_AWAIT_GAME_START:
        return this.renderAwaitingGameStart();

      default:
        return <div>Unknown subphase in PreGame.render(): {this.state.subphase}</div>;
    }
  }

  renderChooseName = () => {
    return (
      <ChooseName
        setPlayer={this.props.setPlayer}
        advanceSubphase={this.advanceSubphase}
      />
    );
  };

  renderAwaitingGameStart = () => {
    return (
      <AwaitingGameStart
        advanceSubphase={this.advanceSubphase}
        setPlayers={this.props.setPlayers}
      />
    );
  };

  advanceSubphase = () => {
    const phaseOrder = Constants.PHASE_ORDER_PRE_GAME;

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

PreGame.propTypes = {
  setPlayer: PropTypes.func.isRequired,
  setPlayers: PropTypes.func.isRequired,
  advancePhase: PropTypes.func.isRequired
}

export default PreGame;