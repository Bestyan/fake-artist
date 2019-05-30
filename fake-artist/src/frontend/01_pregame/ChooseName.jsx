import React, { Component } from "react";
import * as communication from "../communication";
import PropTypes from "prop-types";
import * as Constants from "../../Constants";
import Player from "../../game/Player";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

class ChooseName extends Component {

  nameInput = null;

  render() {
    return (  
      <form onSubmit={event => this.submitName(event)}>
        
        <div>
          <Grid align="center">
        <h2>Choose a name</h2>
        <input type="text" placeholder="Your Name" style={{padding:9}} ref={input => this.nameInput = input} />
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
