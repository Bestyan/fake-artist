import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class FakeGuess extends PureComponent {

  render() {
    return <div>FakeGuess</div>;
  }

}

FakeGuess.propTypes = {
  player: PropTypes.object.isRequired
};

export default FakeGuess;