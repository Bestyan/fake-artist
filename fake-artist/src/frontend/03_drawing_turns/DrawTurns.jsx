import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Canvas from "./Canvas";

class DrawTurns extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      activePlayer: null
    };
  }

  render() {
    const playerName = this.state.activePlayer === null ? "no one" : this.state.activePlayer.name;

    const players = this.props.players.map(player => {
      return <li key={player.id.toString()}>{player.name} (ID {player.id})</li>
    })

    return (
      <div>
        <div>Currently drawing: {playerName}</div>
        <div>Players:
          <ul>{players}</ul>
        </div>
        <Canvas
          player={this.props.player}
          isMyTurn={this.isMyTurn}
          finishTurn={this.finishTurn}
          setActivePlayer={this.setActivePlayer}
          advancePhase={this.props.advancePhase}
          setPicture={this.props.setPicture}
        />
      </div>
    );
  }

  isMyTurn = () => {
    if (this.state.activePlayer === null || this.state.activePlayer === undefined) {
      return false;
    }

    return this.state.activePlayer.id === this.props.player.id;
  };

  finishTurn = () => {
    // disables drawing
    this.setState({
      activePlayer: null
    });
  };

  setActivePlayer = player => {
    this.setState({
      activePlayer: player
    });
  }
}

DrawTurns.propTypes = {
  player: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
  advancePhase: PropTypes.func.isRequired,
  setPicture: PropTypes.func.isRequired
};

export default DrawTurns;