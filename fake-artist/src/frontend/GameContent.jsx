import React, { Component } from "react";
import Canvas from "./Canvas";
import * as Constants from "../Constants";
import Player from "../game/Player";
import ChooseName from "./ChooseName";
import AwaitingGameStart from "./AwaitingGameStart";

class GameContent extends Component {

  player = new Player();

  constructor(props) {
    super(props);

    this.state = {
      phase: Constants.PHASE_CHOOSE_NAME,
      turn: null
    }
  }

  advancePhase = () => {
    const currentPhaseIndex = Constants.PHASE_ORDER.indexOf(this.state.phase);
    const nextPhase = Constants.PHASE_ORDER[currentPhaseIndex + 1];

    console.log(`advancing to phase '${nextPhase}'`)
    this.setState({
      phase: nextPhase
    });
  }

  render() {
    switch (this.state.phase) {
      case Constants.PHASE_CHOOSE_NAME:
        return this.renderChooseName();

      case Constants.PHASE_GAME_START:
        return this.renderAwaitingGameStart();

      case Constants.PHASE_DRAWING_TURNS:
        return this.renderCanvas();

      default:
        return <div>Unknown Phase in GameContent.render()</div>;
    }
  }

  renderChooseName = () => {
    return (
      <div>
        <ChooseName
          setPlayer={player => this.player = player}
          advancePhase={this.advancePhase}
        />
      </div>
    );
  };

  renderAwaitingGameStart = () => {
    return (
      <div>
        <AwaitingGameStart
          advancePhase={this.advancePhase}
        />
      </div>
    );
  }

  renderCanvas = () => {
    return (
      <div>
        <Canvas color="#0000FF" />
      </div>
    );
  };

}

export default GameContent;