import React, { Component } from "react";
import * as Constants from "../Constants";
import Player from "../game/Player";
import PreGame from "./01_pregame/PreGame";
import DrawTurns from "./03_drawing_turns/DrawTurns";
import PreDraw from "./02_predraw/PreDraw";

class GameContent extends Component {

  player = new Player();
  players = null;
  topic = null;
  term = null;

  constructor(props) {
    super(props);

    this.state = {
      phase: Constants.PHASE_PRE_GAME
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
      case Constants.PHASE_PRE_GAME:
        return this.renderPreGame();

      case Constants.PHASE_PRE_DRAW:
        return this.renderPreDraw();

      case Constants.PHASE_DRAWING_TURNS:
        return this.renderDrawTurns();

      default:
        return <div>Unknown Phase in GameContent.render(): {this.state.phase}</div>;
    }
  }

  renderPreGame = () => {
    return (
      <PreGame
        advancePhase={this.advancePhase}
        setPlayer={player => this.player = player}
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