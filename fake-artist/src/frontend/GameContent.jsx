import React, { Component } from "react";
import * as Constants from "../Constants";
import Player from "../game/Player";
import PreGame from "./01_pregame/PreGame";
import DrawTurns from "./03_drawing_turns/DrawTurns";
import PreDraw from "./02_predraw/PreDraw";
import Voting from "./04_voting/Voting";
import FakeGuess from "./05_fake_guess/FakeGuess";
import Grid from "@material-ui/core/Grid";

class GameContent extends Component {

  player = new Player();
  players = null;
  topic = null;
  term = null;
  drawnPicture = null;
  isFakeDetected = false;
  fake = null;

  constructor(props) {
    super(props);

    this.state = {
      phase: Constants.PHASE_PRE_GAME
    }
  }

  advancePhase = () => {
    const currentPhaseIndex = Constants.PHASE_ORDER.indexOf(this.state.phase);
    const nextPhase = Constants.PHASE_ORDER[currentPhaseIndex + 1];

    console.log(`advancing to phase '${nextPhase}'`);
    this.setState({
      phase: nextPhase
    });
  }

  advanceToSummary = () => {
    console.log(`skipping to phase '${Constants.PHASE_SUMMARY}'`);
    this.setState({
      phase: Constants.PHASE_SUMMARY
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

      case Constants.PHASE_VOTING:
        return this.renderVoting();

      case Constants.PHASE_FAKE_GUESS:
        return this.renderFakeGuess();

      default:
        return <div>Unknown Phase in GameContent.render(): {this.state.phase}</div>;
    }
  }

  renderLayout = () => {
    return (
    <Grid container>
      <Grid item sm>
        Players:
      </Grid>
      <Grid item lg>
        Canvas
      </Grid>
     </Grid>
    );
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
        advancePhase={this.advancePhase}
        setPicture={picture => this.drawnPicture = picture}
      />
    );
  };

  renderVoting = () => {
    return (
      <Voting
        advancePhase={this.advancePhase}
        player={this.player}
        players={this.players}
        picture={this.drawnPicture}
        setDetected={detected => this.isFakeDetected = detected}
        setFake={fake => this.fake = fake}
        advanceToSummary={this.advanceToSummary}
      />
    );
  }

  renderFakeGuess = () => {
    return (
      <FakeGuess
        player={this.player}
        term={this.term}
        topic={this.topic}
        advancePhase={this.advancePhase}
      />
    );
  }

}

export default GameContent;