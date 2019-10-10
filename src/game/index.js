import React from "react";
import { GameEngine } from "react-game-engine";
import Renderer from "./graphics/renderer";
import Systems from "./systems";
import Entities from "./entities";

import ShaderPass from "./graphics/passes/shader-pass";
import PixelShader from "./graphics/shaders/pixel-shader";

import "../index.css";

class Game extends React.Component {
  render() {
    return (
      <GameEngine
        className="game"
        systems={Systems}
        entities={Entities()}
        renderer={Renderer(
          new ShaderPass(PixelShader())
        )}
      />
    );
  }
}

export default Game;
