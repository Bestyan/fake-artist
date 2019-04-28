import React, { Component } from 'react';
import GameContent from "./frontend/GameContent";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <header>{/* header */}</header>
        <GameContent>{/* main */}</GameContent>
        <footer>{/* footer */}</footer>
      </div>);
  }
}

export default App;
