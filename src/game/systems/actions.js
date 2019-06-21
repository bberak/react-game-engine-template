import { Easing } from "react-native";
import * as THREE from 'three';

const easeOutCubic = Easing.out(Easing.cubic)

const constrain = (min, max, val) => {
  if (val > max) return max;
  if (val < min) return min;
  return val;
}

const bracing = (projectile, events) => {
  const holding = events.find(e => e.type == "hold");

  if (holding)
    projectile.actions.brace.setEffectiveWeight(constrain(0, 1, easeOutCubic(holding.strength)))  
  else
    projectile.actions.brace.setEffectiveWeight(constrain(0, 1, projectile.actions.brace.weight * 0.8))
}

const jumping = (projectile) => {
  const isMovingVertically = projectile.physics.velocity.y != 0;

  if(isMovingVertically)
    projectile.actions.jump.setEffectiveWeight(constrain(0, 1, projectile.actions.jump.weight + projectile.physics.velocity.y))  
  else
    projectile.actions.jump.setEffectiveWeight(constrain(0, 1, projectile.actions.jump.weight * 0.8))

}

const landing = (projectile, destination) => {
  const isMovingHorizontally = projectile.physics.velocity.z !== 0 || projectile.physics.velocity.x !== 0;
  const isMovingDownwards = projectile.physics.velocity.y < 0;

  if (isMovingDownwards && isMovingHorizontally) {
    const dist = projectile.physics.position.y - destination.physics.position.y

    if (dist > 1.5)
      projectile.actions.land.setEffectiveWeight(constrain(0, 1, projectile.actions.land.weight + 0.03))
    else
       projectile.actions.land.setEffectiveWeight(constrain(0, 1, projectile.actions.land.weight - 0.05))
  } else
    projectile.actions.land.setEffectiveWeight(constrain(0, 1, projectile.actions.land.weight * 0.8))
}

const Actions = (entities, { events }) => {
  const projectile = entities[Object.keys(entities).find(x => entities[x].projectile && entities[x].actions && entities[x].physics)];
  const destination = entities[Object.keys(entities).find(x => entities[x].destination && entities[x].physics)];

  if (projectile && destination) {
    bracing(projectile, events);
    jumping(projectile);
    landing(projectile, destination);
  }

  return entities;
}

export default Actions;