import React, { Component } from "react";
import * as communication from "../communication";
import PropTypes from "prop-types";
import * as Constants from "../../Constants";
import Player from "../../shared/Player";
import { AppBar, Toolbar, Typography, Button, Grid } from "@material-ui/core";

class ChooseName extends Component {

  nameInput = null;

  render() {
    return (
      <form onSubmit={event => this.submitName(event)}>
        <div>
          <AppBar position="static">
            <Toolbar >
              <Typography variant="title" color="inherit">
                Fake Artist
              </Typography>
              <Button color="inherit" align="center">Rules</Button>
              <Button color="inherit" align="center">Tutorial</Button>
            </Toolbar>
          </AppBar>
        </div>
        <div>
          <Grid align="center">
            <h2>Choose a name</h2>
            <input type="text" placeholder="Your Name" style={{ padding: 9 }} ref={input => this.nameInput = input} />
            <Button variant="contained" color="inherited" type="submit">go</Button>
          </Grid>
        </div>
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
