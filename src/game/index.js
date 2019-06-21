import React, { Component } from "react";
import { GameEngine } from "react-game-engine";
import Systems from "./systems";
import Entities from "./entities";
import Renderer from "./graphics/renderer";
import "../app.css";


class Game extends Component {
  render() {
    return (
      <GameEngine
        className="Container"
        systems={Systems}
        entities={Entities()}
        renderer={Renderer()}
      >
        {this.props.children}
      </GameEngine>
    );
  }
}

export default Game;
