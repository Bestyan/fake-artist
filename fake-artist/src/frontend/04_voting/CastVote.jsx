import React, { Component } from "react";
import * as Constants from "../../Constants";
import PropTypes from "prop-types";
import * as communication from "../communication";
import Candidate from "./Candidate";

class CastVote extends Component {
  render() {

    const candidates = this.props.players.map(player => {

      // players cannot vote for themselves
      if (player.id === this.props.player.id) {
        return "";
      }

      return (
        <Candidate
          candidate={player}
          vote={() => this.vote(player.id)}
          key={player.id}
        />
      )
    });

    return (
      <div>
        {candidates}
      </div>
    );
  }

  vote = id => {
    communication.castVote(
      id,
      this.props.player.id,
      json => {
        if(json[Constants.RESPONSE_STATUS] === "fail"){
          console.log(json[Constants.RESPONSE_MESSAGE]);
          return;
        }
        this.props.advanceSubphase();
      },
      error => {
        console.log(error);
      });
  };
}

CastVote.propTypes = {
  players: PropTypes.array.isRequired,
  player: PropTypes.object.isRequired,
  advanceSubphase: PropTypes.func.isRequired
}

export default CastVote;