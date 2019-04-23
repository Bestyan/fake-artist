import React, { Component } from 'react';
import Content from "./frontend/Content";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <header>{/* header */}</header>
        <Content>{/* main */}</Content>
        <footer>{/* footer */}</footer>
      </div>);
  }
}

export default App;
