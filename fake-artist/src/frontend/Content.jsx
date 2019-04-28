import React, { Component } from "react";
import Canvas from "./Canvas";
import * as Constants from "../Constants";

class Content extends Component {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <GameContent />
      </div>
    );
  }
}

export default Content;