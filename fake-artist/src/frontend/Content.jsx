import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import GameContent from "./GameContent";
import Paper from "@material-ui/core/Paper";


class Content extends Component {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <div>
          <AppBar position="static" color="primary">
            <Toolbar >
              <Typography variant="title" color="inherit">
                Fake Artist
              </Typography>
              <Button color="inherit">Rules</Button>
              <Button color="inherit">Tutorial</Button>
            </Toolbar>
           </AppBar>
           </div>
        <GameContent />
      </div>
    );
  }
}

export default Content;