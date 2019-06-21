import { Easing } from "react-native"
import Platform, { scale, rotate, move, oscillate } from "../components/platform";
import * as THREE from 'three';
import { spring } from "popmotion";
import { first, all, pipe, id, positive, negative, cond, remap, clamp, interpolate, log } from "../utils";
import { direction, rotateAroundPoint, getSize } from "../utils/three";
import _ from "lodash";

const next = (id => () => id("platform"))(id(2))

const generatePlatforms = ({ scene, currentPlatform, dx, dz, hops }) => {
  const difficulty = Math.random();
  const difficulties = [0, Math.random(), Math.random(), Math.random(), 1].sort().map((n, i, a) => [n, a[i+1]]).splice(0, 4)
    .map(([min, max]) => max - min)
    .map(x => x * difficulty);

  const currentSize = getSize(currentPlatform.model);  
  const breadth = remap(difficulties[0], 0, difficulty, 2, 0.3)
  const minDistance = breadth * 0.5 + Math.max(currentSize.x, currentSize.z) * 0.5 + 0.4;
  const distance = remap(difficulties[1], 0, difficulty, minDistance, 4)
  const range = remap(difficulties[2], 0, difficulty, 0, 5)
  const speed = remap(difficulties[3], 0, difficulty, 0, 0.0035)

  const pos =  new THREE.Vector3(dx * distance, 0, dz * distance).add(currentPlatform.physics.position)
  const size = new THREE.Vector3(dx ? breadth : 1.1, 0.55, dz ? breadth : 1.1)

  const p1 = Platform({ scene, source: false, destination: true, x: pos.x, y: pos.y, z: pos.z, width: size.x, height: size.y, breadth: size.z })

  return [
    pipe(
      scale(), 
      rotate(), 
      cond(difficulty > 0.5, oscillate({ range: [range * 0.5, 0 - range * 0.5 ], speed }))
    )(p1)
  ]
}

const spin = ({ currentPlatform, projectile, dx, dz }) => {
  //-- Need to set the rotation to zero before calculating the direction..
  //-- This is usually done by the flip system when the projectile isn't moving
  //-- But that it is dependendent on the order of the systems, and I want to avoid
  //-- the need to order the systems precisely..
  projectile.model.rotation.x = 0

  const dir = direction(projectile.model);
  const dest = new THREE.Vector3(dx, 0, dz);
  const angle = cond(a => a > 0 && dz < 0, negative)(dest.angleTo(dir))
  
  spring({
    from: [currentPlatform.model.rotation.y, projectile.model.rotation.y],
    to: [currentPlatform.model.rotation.y + angle, projectile.model.rotation.y + angle],
    stiffness: 150,
    damping: 8
  }).start(([platformAngle, projectileAngle]) => {
    currentPlatform.model.rotation.y = platformAngle
    rotateAroundPoint(projectile.model, currentPlatform.model.position, { thetaY: projectileAngle - projectile.model.rotation.y })
  });
}

const drop = (platforms = []) => {
  platforms.forEach(p => {
    p.destination = null
    p.spring = null
    p.animations = null
  })
}

const Landing = (entities, { events, dispatch }) => {
  const collision = events.find(x => x.type == "collision");

  if (collision) {
    const projectile = collision.entities.find(x => x.projectile && x.model);
    const destination = collision.entities.find(x => x.destination && x.model);

    if (projectile && destination) {
      const scene = entities.three.scene;
      const source = first(entities, x => x.model, x => x.source) 
      const destinations = all(entities, x => x.destination)
      const dir = Math.random() > 0.5 ? "x" : "z";

      source.source = false;
      source.destination = false;
      source.removable = true;

      destination.source = true;
      destination.destination = false;

      const dx = dir == "x" ? -1 : 0;
      const dz = dir == "z" ? -1 : 0;
      const x = destination.model.position.x + dx;
      const y = destination.model.position.y;
      const z = destination.model.position.z + dz;
      const platforms = generatePlatforms({ scene, dx, dz, currentPlatform: destination }).map(p => { entities[next()] = p; return p })

      spin({ currentPlatform: destination, projectile, dx, dz })
      drop(destinations.filter(x => x != destination))
    }
  }

  dispatch({ type: "landed" });
  
  return entities;
}

export default Landing;