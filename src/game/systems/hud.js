const HUD = (entities, args) => {
  
  const hud = entities.hud;

  if (hud) {
    hud.stickController = args.stickController;
    hud.keyController = args.keyController;
  }

  return entities;
};

export default HUD;