import Box from "../components/box"
import Cylinder from "../components/cylinder"
import { id } from "../utils";

const boxId = (id => () => id("box"))(id(0));
const cylinderId = (id => () => id("cylinder"))(id(0));

const Spawn = (entities, { gamepadController }) => {

  const world = entities.world;
  const scene = entities.scene;

  if (gamepadController.button0 && !gamepadController.previous.button0)
  	entities[boxId()] = Box({ parent: scene, world, y: 5 });

  if (gamepadController.button1 && !gamepadController.previous.button1)
  	entities[cylinderId()] = Cylinder({ parent: scene, world, y: 5 });

  return entities;
};

export default Spawn;
