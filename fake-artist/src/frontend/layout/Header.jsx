import React from "react";
import { AppBar, Toolbar, Typography, Container } from "@material-ui/core";
import NavBar from "./NavBar";
import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";

const Header = props => {
  return (
    <AppBar position="static" color="primary">
      <Container>
        <ToolbarNoPadding>
          <UnstyledLink to="/">
            <Typography variant="h4">Fake Artist</Typography>
          </UnstyledLink>
          <NavBar />
        </ToolbarNoPadding>
      </Container>
    </AppBar>
  );
}

// !important is necessary to override the materialUI style
const ToolbarNoPadding = styled(Toolbar)`
  padding-left: 0 !important;
  padding-right: 0 !important;
`;

// prevent the ugly default link
const UnstyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:focus, &:hover, &:visited, &:link, &:active {
      text-decoration: none;
      color: inherit;
  }
`;

export default Header;