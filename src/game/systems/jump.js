import { direction } from "../utils/three"

const Jump = (entities, { events, dispatch }) => {
  const letGo = events.find(x => x.type == "let-go")

  if (letGo && letGo.strength > 0.05) {
    const source = entities[Object.keys(entities).find(x => entities[x].source)];
    const destination = entities[Object.keys(entities).find(x => entities[x].destination)];
    const projectile = entities[Object.keys(entities).find(x => entities[x].physics && entities[x].projectile)];
    const dir = direction(projectile.model)

    dir.multiplyScalar(0.25 * letGo.strength);
    dir.y = letGo.strength * 0.65;
    
    projectile.physics.forces.add(dir);

    dispatch({ type: "jumped" })
  }

  return entities;
}

export default Jump;