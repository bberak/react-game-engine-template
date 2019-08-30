import React from "react";
import { GameEngine } from "react-game-engine";
import Renderer from "./graphics/renderer";
import Systems from "./systems";
import Entities from "./entities";
import "../app.css";

class Game extends React.Component {
  render() {
    return (
      <GameEngine
        className="Container"
        systems={Systems}
        entities={Entities()}
        renderer={Renderer(
          //new ShaderPass(PixelShader()),
          //new ShaderPass(ScanlineShader())
        )}
      />
    );
  }
}

export default Game;
