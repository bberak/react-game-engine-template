const Motion = entities => {
  const physicsKeys = Object.keys(entities).filter(
    x => entities[x].physics
  );

  physicsKeys.forEach(m => {
    const { mass, forces, acceleration, velocity, position, maxSpeed, damping } = entities[m].physics;

    forces.divideScalar(mass);
    acceleration.add(forces);

    if (damping)
      velocity.multiplyScalar(1 - damping);

    velocity.add(acceleration)

    if (maxSpeed)
      velocity.clampLength(0, maxSpeed)
    
    position.add(velocity);

    forces.set(0 ,0 ,0);
    acceleration.set(0, 0, 0);
  })

  return entities;
}

export default Motion;