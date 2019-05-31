import React, { Component } from "react";
import * as communication from "../communication";
import PropTypes from "prop-types";
import * as Constants from "../../shared/Constants";
import Player from "../../shared/Player";
import { Box, Button, TextField, Typography } from "@material-ui/core";

class ChooseName extends Component {

  nameInput = null;

  render() {
    return (
      <form onSubmit={event => this.submitName(event)}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h4">Choose a name</Typography>
          <Box display="flex" alignItems="center">
            <TextField type="text" label="Your Name" ref={input => this.nameInput = input} />
            <Button variant="contained" color="inherit" type="submit">go</Button>
          </Box>
        </Box>
      </form>

    );
  }

  submitName = event => {
    event.preventDefault();

    const name = this.nameInput.value;
    if (name && name.length === 0) {
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
          this.props.advanceSubphase();
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
  advanceSubphase: PropTypes.func.isRequired
}

export default ChooseName;
