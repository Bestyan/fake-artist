import React, { Component } from "react";
import * as Constants from "../Constants";
import Player from "../game/Player";
import ChooseName from "./01_pregame/ChooseName";
import AwaitingGameStart from "./01_pregame/AwaitingGameStart";
import DrawTurns from "./03_draw/DrawTurns";
import PreDraw from "./02_predraw/PreDraw";

class GameContent extends Component {

  player = new Player();
  players = null;
  topic = null;
  term = null;

  constructor(props) {
    super(props);

    this.state = {
      phase: Constants.PHASE_CHOOSE_NAME
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

      case Constants.PHASE_PRE_DRAW:
        return this.renderPreDraw();

      case Constants.PHASE_DRAWING_TURNS:
        return this.renderDrawTurns();

      default:
        return <div>Unknown Phase in GameContent.render()</div>;
    }
  }

  renderChooseName = () => {
    return (
      <ChooseName
        setPlayer={player => this.player = player}
        advancePhase={this.advancePhase}
      />
    );
  };

  renderAwaitingGameStart = () => {
    return (
      <AwaitingGameStart
        advancePhase={this.advancePhase}
        setPlayers={players => this.players = players}
      />
    );
  }

  renderPreDraw = () => {
    return (
      <PreDraw
        advancePhase={this.advancePhase}
        player={this.player}
        setTopic={topic => this.topic = topic}
        setTerm={term => this.term = term}
      />
    );
  }

  renderDrawTurns = () => {
    return (
      <DrawTurns
        player={this.player}
        players={this.players}
      />
    );
  };

}

export default GameContent;