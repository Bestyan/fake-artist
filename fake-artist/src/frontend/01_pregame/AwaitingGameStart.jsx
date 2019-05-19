import React, { PureComponent } from "react";
import * as communication from "../communication";
import PropTypes from "prop-types";
import * as Constants from "../../Constants";
import * as GameConfig from "../../game/GameConfig";

class AwaitingGameStart extends PureComponent {

  pollingInterval = null;

  constructor(props) {
    super(props);

    this.state = {
      players: [],
      status: ""
    }
  }

  componentDidMount() {
    this.startPolling();
  }

  render() {
    const players = this.state.players.map(player => {
      return <li key={player.id.toString()}>{player.name} ({player.id})</li>
    });

    return (
      <div>
        <div>Players<br />
          <ul>{players}</ul>
        </div>
        <div>Game Status: {this.state.status}
        </div>
      </div>
    );
  }

  /**
   * poll the server repeatedly for whether or not the game has started
   */
  pollGameStart = () => {
    communication.pollGameStart(
      json => {
        const players = json[Constants.GET_GAME_START_PLAYERS];
        const status = json[Constants.GET_GAME_START_STATUS];

        this.setState({
          players: players,
          status: status
        });

        if (status === "start") {
          this.stopPolling();
          this.props.setPlayers(players);
          this.props.advancePhase();
        }
      },
      error => {
        console.log(error);
      }
    );
  };

  startPolling = () => {
    if (this.pollingInterval === null) {
      this.pollingInterval = setInterval(this.pollGameStart, GameConfig.GAME_START_POLLING_INTERVAL_MS);
    }
  };

  stopPolling = () => {
    clearInterval(this.pollingInterval);
    this.pollingInterval = null;
  };
}

AwaitingGameStart.propTypes = {
  advancePhase: PropTypes.func.isRequired
}

export default AwaitingGameStart;