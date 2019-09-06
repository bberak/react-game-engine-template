const HUD = (entities, args) => {
  
  const hud = entities.hud;

  if (hud) {
    hud.gamepadController = args.gamepadController;
    hud.keyController = args.keyController;
  }

  return entities;
};

export default HUD;