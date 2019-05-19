import React, { PureComponent } from "react";
import * as communication from "../communication";
import PropTypes from "prop-types";
import * as Constants from "../../Constants";
import Canvas from "./Canvas";
import * as GameConfig from "../../game/GameConfig";

class DrawTurns extends PureComponent {

  pollingActivePlayerInterval = null;

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
          startPolling={this.startPollingActivePlayer}
          stopPolling={this.stopPollingActivePlayer}
          finishTurn={this.finishTurn}
        />
      </div>
    );
  }

  componentDidMount() {
    this.startPollingActivePlayer();
  }

  componentWillUnmount() {
    this.stopPollingActivePlayer();
  }

  isMyTurn = () => {
    if (this.state.activePlayer === null || this.state.activePlayer === undefined) {
      return false;
    }

    return this.state.activePlayer.id === this.props.player.id;
  };

  finishTurn = () => {
    this.setState({
      activePlayer: null
    });
  }

  pollActivePlayer = () => {
    communication.pollActivePlayer(
      json => {
        const activePlayer = json[Constants.GET_ACTIVE_PLAYER_ACTIVE_PLAYER];
        this.setState({
          activePlayer: activePlayer
        });
      },
      error => {
        console.log(error);
      }
    )
  };

  startPollingActivePlayer = () => {
    if (this.pollingActivePlayerInterval === null) {
      this.pollingActivePlayerInterval = setInterval(this.pollActivePlayer, GameConfig.ACTIVE_PLAYER_POLLING_INTERVAL_MS);
    }
  };

  stopPollingActivePlayer = () => {
    clearInterval(this.pollingActivePlayerInterval);
    this.pollingActivePlayerInterval = null;
  };

}

DrawTurns.propTypes = {
  player: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired
};

export default DrawTurns;