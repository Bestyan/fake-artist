import React, { PureComponent } from "react";
import * as communication from "../communication";
import PropTypes from "prop-types";
import * as Constants from "../../shared/Constants";
import * as GameConfig from "../../shared/GameConfig";

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
        <div><br />
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
          this.props.advanceSubphase();
        }
      },
      error => {
        console.log(error);
      }
    );
  };

  startPolling = () => {
    if (this.pollingInterval === null) {
      this.pollingInterval = setInterval(this.pollGameStart, GameConfig.POLLING_INTERVAL_MS);
    }
  };

  stopPolling = () => {
    clearInterval(this.pollingInterval);
    this.pollingInterval = null;
  };
}

AwaitingGameStart.propTypes = {
  advanceSubphase: PropTypes.func.isRequired
}

export default AwaitingGameStart;