import React from "react";
import PropTypes from "prop-types";
import * as Components from "../components/Components";

const PlayerVoteResult = props => {
  const player = props.result.player;
  const votes = props.result.votes;
  return (
    <Components.ResultListItem
      playerColor={player.color}
      fontColor={Components.getFontColorForBackground(player.color)}
    >
      {player.name} : {votes}
    </Components.ResultListItem>
  );
};

PlayerVoteResult.propTypes = {
  result: PropTypes.object.isRequired
};

export default PlayerVoteResult;