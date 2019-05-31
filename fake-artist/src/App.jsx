import React, { Component } from 'react';
import Content from "./frontend/layout/Content";
import { Grid, CssBaseline } from "@material-ui/core";
import Header from "./frontend/layout/Header";
import Footer from "./frontend/layout/Footer";

class App extends Component {
  render() {
    return (
      <Grid container direction="column" justify="space-between">
        {/* removes the default body margin */}
        <CssBaseline />
        <Header />
        <Content />
        <Footer />
      </Grid>
    );
  }
}

export default App;
