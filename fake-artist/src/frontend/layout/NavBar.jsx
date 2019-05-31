import React from "react";
import { ListItem, Toolbar } from "@material-ui/core";
import {Link} from "react-router-dom";

const NavBar = props => {
  return (
    <Toolbar component="nav">
      
      <ListItem button inset="true" component={Link} to="/game">PLAY</ListItem>

      <ListItem button inset="true" component={Link} to="/rules">RULES</ListItem>

      <ListItem button inset="true" component={Link} to="/tutorial">TUTORIAL</ListItem>

      <ListItem button inset="true" component={Link} to="/about">ABOUT</ListItem>

    </Toolbar>
  );
};

export default NavBar;