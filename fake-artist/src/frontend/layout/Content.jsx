import React, { Component } from "react";
import GameContent from "../pages/GameContent";
import { Container} from "@material-ui/core";
import { Route, Switch } from 'react-router-dom';
import Rules from "../pages/Rules";
import About from "../pages/About";
import Tutorial from "../pages/Tutorial";

class Content extends Component {

  render() {
    return (
      <Container>
        <Switch>
          <Route path="/game" component={GameContent} />
          <Route path="/rules" component={Rules} />
          <Route path="/tutorial" component={Tutorial} />
          <Route path="/about" component={About} />
          <Route path="/" exact component={GameContent} />
        </Switch>
      </Container>
    );
  }
}

export default Content;