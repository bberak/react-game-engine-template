import Box from "../components/box"
import Cylinder from "../components/cylinder"
import { id } from "../utils";

const boxId = (id => () => id("box"))(id(0));
const cylinderId = (id => () => id("cylinder"))(id(0));

const Spawn = (entities, { stickController }) => {

  const world = entities.world;
  const scene = entities.scene;

  if (stickController.leftTrigger && !stickController.previous.leftTrigger)
  	entities[boxId()] = Box({ parent: scene, world, y: 5 });

  if (stickController.rightTrigger && !stickController.previous.rightTrigger)
  	entities[cylinderId()] = Cylinder({ parent: scene, world, y: 5 });

  return entities;
};

export default Spawn;
