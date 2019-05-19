import React, { Component } from "react";
import PropTypes from "prop-types";
import AwaitTopic from "./AwaitTopic";
import DeclareTopic from "./DeclareTopic";
import * as Constants from "../../Constants";
import AwaitRole from "./AwaitRole";

class PreDraw extends Component {

  constructor(props) {
    super(props);

    this.state = {
      subphase: Constants.PHASE_PRE_DRAW_AWAIT_ROLE
    }
  }

  render() {
    switch (this.state.subphase) {
      case Constants.PHASE_PRE_DRAW_AWAIT_ROLE:
        return this.renderAwaitRole();

      case Constants.PHASE_PRE_DRAW_DECLARE_TOPIC_AND_TERM:
        return this.renderDeclareTopicAndTerm();
        
      default:
        return <div>Unknown subphase in PreDraw.render(): {this.state.subphase}</div>;
    }
  }

  renderAwaitRole = () => {
    return (
      <AwaitRole
        player={this.props.player}
        advanceSubphase={this.advanceSubphase}
      />
    );
  }

  renderDeclareTopicAndTerm = () => {
    switch (this.props.player.role) {
      case "artist":
        return (
          <AwaitTopic
            setTopic={this.props.setTopic}
            setTerm={this.props.setTerm}
            player={this.props.player}
            advanceSubphase={this.advanceSubphase}
          />
        );
      case "question-master":
        return (
          <DeclareTopic
            topic={this.state.topic}
            setTopic={this.props.setTopic}
            setTerm={this.props.setTerm}
            player={this.props.player}
            advanceSubphase={this.advanceSubphase}
          />
        );
      default:
        return <p>Unknown player role in PreDraw.render(): '{this.props.player.role}'</p>
    }
  }

  advanceSubphase = () => {
    const phaseOrder = Constants.PHASE_ORDER_PRE_DRAW;

    const nextPhaseIndex = phaseOrder.indexOf(this.state.subphase) + 1;

    if (nextPhaseIndex >= phaseOrder.length) {
      this.props.advancePhase();
      return;
    }

    const nextPhase = phaseOrder[nextPhaseIndex];

    console.log(`advancing to subphase '${nextPhase}'`)
    this.setState({
      subphase: nextPhase
    });
  };
}

PreDraw.propTypes = {
  player: PropTypes.object.isRequired,
  advancePhase: PropTypes.func.isRequired,
  setTopic: PropTypes.func.isRequired,
  setTerm: PropTypes.func.isRequired
}

export default PreDraw;