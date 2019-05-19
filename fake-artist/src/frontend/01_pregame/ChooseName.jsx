import React, { Component } from "react";
import * as communication from "../communication";
import PropTypes from "prop-types";
import * as Constants from "../../Constants";
import Player from "../../game/Player";

class ChooseName extends Component {

  nameInput = null;

  render() {
    return (
      <form onSubmit={event => this.submitName(event)}>
        <h1>Choose a name</h1>
        <input type="text" ref={input => this.nameInput = input} />
        <button type="submit">go</button>
      </form>
    );
  }

  submitName = event => {
    event.preventDefault();

    const name = this.nameInput.value;
    if (name.length === 0) {
      return;
    }

    communication.chooseName(name,
      json => {
        if (json.status === "success") {
          const player = new Player();
          player.id = json[Constants.PUT_NAME_PLAYER_ID];
          player.name = json[Constants.PUT_NAME_PLAYER_NAME];
          player.color = json[Constants.PUT_NAME_PLAYER_COLOR];
          this.props.setPlayer(player);
          this.props.advancePhase();
        }

        if (json.status === "fail") {
          console.log(json);
        }
      },
      error => {
        console.log(error);
      });

  };
};

ChooseName.propTypes = {
  setPlayer: PropTypes.func.isRequired,
  advancePhase: PropTypes.func.isRequired
}

export default ChooseName;
