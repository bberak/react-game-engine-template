import { first, id, throttle, memoize } from "../utils";
import * as THREE from "three";
import Bullet from "../components/bullet";
import _ from "lodash";

const readKey = (input, keys, name) => input.find(x => x.name === name && keys.indexOf(x.payload.key) !== -1);

const createKeyControl = keys => {
  let down = false;

  return input => {
    if (readKey(input, keys, "onKeyDown"))
      down = true;
    
    if (readKey(input, keys, "onKeyUp"))
      down = false;

    return down;
  }
};

const createSwipeControl = ({ x, y }) => {
  let touchStart = null;

  return input => {
    let temp = input.find(x => x.name === "onTouchStart");

    if (temp)
      touchStart = temp;

    const touchMove = input.find(x => x.name === "onTouchMove");

    if (touchStart && touchMove) {

      const diffX = touchMove.payload.targetTouches[0].pageX - touchStart.payload.targetTouches[0].pageX;
      const diffY = touchMove.payload.targetTouches[0].pageY - touchStart.payload.targetTouches[0].pageY;

      touchStart = touchMove;

      if (x && x(diffX))
        return diffX;
      else if (y && y(diffY))
        return diffY;
    }
  };
};

const touchCount = input => {
  const touches = input.filter(x => ["onTouchStart", "onTouchMove"].indexOf(x.name) !== -1);

  if (touches.length)
    return _.max(touches.map(x => x.payload.targetTouches.length))
  else
    return 0;
};

const fire = (player, entities) => {
  const scene = entities.scene;
  const vel = player.physics.velocity.clone().normalize().multiplyScalar(0.2);
  entities[bulletId()] = Bullet({
    scene,
    x: player.model.position.x,
    y: player.model.position.y,
    z: player.model.position.z,
    forces: vel
  });

  //-- Add some recoil
  player.physics.forces.addScaledVector(vel, Math.random() * -0.42);
};

const bulletId = (id => () => id("bullet"))(id(0));
const throttled = memoize(throttle, (x, y) => x.toString() + y);
const forwardThrust = new THREE.Vector3(0, 0, -0.03);

const left = createKeyControl(["a", "A", "ArrowLeft"]);
const right = createKeyControl(["d", "D", "ArrowRight"]);
const shoot = createKeyControl([" ", "Control"]);
const swipeLeft = createSwipeControl({ x: val => val < 0 });
const swipeRight = createSwipeControl({ x: val => val > 0 });

const SpringControls = (entities, { input, dispatch }) => {

  const player = first(entities, e => e.physics && e.player && e.model);

  player.physics.forces.add(forwardThrust);

  const _left = left(input);
  const _right = right(input);
  const _swipeLeft = swipeLeft(input);
  const _swipeRight = swipeRight(input);
  const _shoot = shoot(input);
  const _touchCount = touchCount(input);

  if (_left) {

    player.spring.anchor.x -= 0.15;

    throttled(dispatch, 250)({ type: "input", entityId: "player", control: "left" });

  } else if (_right) {

    player.spring.anchor.x += 0.15;

    throttled(dispatch, 250)({ type: "input", entityId: "player", control: "right" });
  
  } else if (_swipeLeft) {

     player.spring.anchor.x += _swipeLeft* 0.02;

     throttled(dispatch, 250)({ type: "input", entityId: "player", control: "swipe-left" });

  } else if (_swipeRight) {

    player.spring.anchor.x += _swipeRight * 0.02;

    throttled(dispatch, 250)({ type: "input", entityId: "player", control: "swipe-right" });
  }

  if (_shoot || _touchCount > 1) 
    throttled(fire, 100)(player, entities);

  return entities;
};

export default SpringControls;
