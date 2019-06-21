const Focus = entities => {
  const lookAtVector = entities.three.camera.lookAtVector;
  const focusedItems = Object.keys(entities)
    .filter(x => entities[x].model && entities[x].focus)
    .map(x => entities[x])

  focusedItems.forEach(x => {
    if (lookAtVector.z < x.model.position.z) {
      x.model.position.z -= 1;
    }

    if (lookAtVector.x < x.model.position.x) {
      x.model.position.x -= 1;
    }
  });

  return entities;
}

export default Focus;