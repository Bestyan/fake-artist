import React, { Component } from "react";
import PropTypes from "prop-types";
import * as communication from "../communication";
import * as Constants from "../../Constants";
import * as GameConfig from "../../game/GameConfig";

class AwaitRole extends Component {

  getRoleInterval = null;

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      hasRole: false
    };
  }

  render() {
    if(!this.state.hasRole){
      return this.renderWaitingForRole();
    } else{
      return this.renderYourRoleIs();
    }
    
  }

  renderWaitingForRole = () => {
    return (
      <div>
        <p>Waiting for role...</p>
        <p>{this.state.error === null ? "" : this.state.error.toString()}</p>
      </div>
    );
  };

  renderYourRoleIs = () => {
    return (
      <div>
        <p>Your role is <strong>{this.props.player.role}</strong></p>
      </div>
    );
  }

  componentDidMount() {
    this.fetchRole();
  }

  fetchRole = () => {
    communication.fetchRole(
      this.props.player.id,

      json => {
        if(json[Constants.RESPONSE_STATUS] === "fail"){
          console.log(json[Constants.RESPONSE_MESSAGE]);
          this.setState({
            error: json[Constants.RESPONSE_MESSAGE]
          });
          return;
        }

        this.props.player.setRole(json[Constants.POST_ROLE_PLAYER_ROLE]);
        this.setState({
          hasRole: true
        });
        setTimeout(this.props.advanceSubphase, GameConfig.DISPLAY_ROLE_TIME_MS);
      },

      error => {
        console.log(error);
        this.setState({
          error: error
        });

        setTimeout(this.fetchRole, GameConfig.AWAIT_ROLE_FETCH_INTERVAL_MS);
      }
    );
  }


}

AwaitRole.propTypes = {
  player: PropTypes.object.isRequired,
  advanceSubphase: PropTypes.func.isRequired
}

export default AwaitRole;