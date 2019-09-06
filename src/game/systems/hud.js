const HUD = (entities, args) => {
  
  const hud = entities.hud;

  if (hud) {
    hud.gamepadController = args.gamepadController;
    hud.keyController = args.keyController;
    hud.mouseController = args.mouseController;
  }

  return entities;
};

export default HUD;