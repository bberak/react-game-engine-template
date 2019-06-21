import { first, id, throttle, memoize } from "../utils";
import * as THREE from "three";
import Bullet from "../components/bullet";
import _ from "lodash";

const bulletOffset = new THREE.Vector3();

const shoot = (player, entities, forward, controller) => {
  const scene = entities.scene;
  const forces = forward.clone().normalize().multiplyScalar(0.175);

  bulletOffset.set(0.4, 0, 0);
  bulletOffset.applyEuler(player.model.rotation);

  entities[bulletId()] = Bullet({
    scene,
    x: player.model.position.x + bulletOffset.x, 
    y: player.model.position.y + bulletOffset.y,
    z: player.model.position.z + bulletOffset.z,
    forces
  });

  //-- Add some recoil
  player.physics.forces.addScaledVector(forces, -0.07);

  //-- Add some vibes :)
  controller.vibrate({ duration: 100, strongMagnitude: 0.1 });
};

const bulletId = (id => () => id("bullet"))(id(0));
const throttled = memoize(throttle, (x, y) => x.toString() + y);
const forward = new THREE.Vector3(0, 0, 0);
const rotation = new THREE.Euler();

let theta = Math.PI * 0.5;
let angularAccelertion = 0;
let acceleration = 0;

const Controls = (entities, { input, dispatch, controller }) => {

  const player = first(entities, e => e.physics && e.player && e.model);
  const { accelerate, left, right, fire } = controller;

  const logic = [

    //-- Accelerating?
    [accelerate, () => {
      angularAccelertion = 0.05;
      acceleration = 0.05;
      player.physics.damping = 0.118;
      player.physics.maxSpeed = 0.5;
    }],
    [!accelerate, () => {
      angularAccelertion = 0.1;
      acceleration = 0.006;
      player.physics.damping = 0.008;
      player.physics.maxSpeed = 0.125;
    }],

    //-- Left turn
    [left, () => {
      theta += angularAccelertion;
      throttled(dispatch, 250)({ type: "input", entityId: "player", control: "left" });
    }],
    [left && accelerate, () =>  player.model.rotation.x = Math.max(player.model.rotation.x - 0.05, -Math.PI * 0.8)],

    //-- Right turn
    [right, () => {
      theta -= angularAccelertion;
      throttled(dispatch, 250)({ type: "input", entityId: "player", control: "right" });
    }],
    [right && accelerate, () =>  player.model.rotation.x = Math.min(player.model.rotation.x + 0.05, Math.PI * 0.8)],

    //-- Force upright
    [!accelerate || (!left && !right), Math.abs(player.model.rotation.x) > 0.01, () => player.model.rotation.x = player.model.rotation.x * 0.95],

     //-- Shooting
    [fire, () => throttled(shoot, 100)(player, entities, forward, controller)],

    //-- Rotation and thrust
    [true, () => {
      player.model.rotation.y = theta;
      rotation.set(0, theta, 0);
      forward.set(acceleration, 0, 0);
      forward.applyEuler(rotation);
      player.physics.forces.add(forward);
    }]
  ];

  logic.forEach(conditions => {
    const [func] = conditions.splice(conditions.length -1);
    if (_.every(conditions))
      func();
  })

  return entities;
};

export default Controls;
