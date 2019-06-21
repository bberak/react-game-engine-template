const GameOver = (entities, { events, dispatch }) => {
  const collision = events.find(x => x.type == "collision");

  if (collision) {
    const projectile = collision.entities.find(x => x.projectile);
    const terrain = collision.entities.find(x => x.terrain);

    if (projectile && terrain)
      dispatch({ type: "game-over" });
  } else {
    const destination = entities[Object.keys(entities).find(x => entities[x].physics && entities[x].destination)];
    const projectile = entities[Object.keys(entities).find(x => entities[x].physics && entities[x].projectile)];

    if (destination && projectile && 
        destination.physics.position.distanceTo(projectile.physics.position) > 12) {
      dispatch({ type: "game-over" });
    }
  }

  return entities;
}

export default GameOver;