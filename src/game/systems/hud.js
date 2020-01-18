const HUD = (entities, args) => {
  
  const hud = entities.hud;

  if (hud) {
    hud.gamepadController = args.gamepadController;
    hud.keyboardController = args.keyboardController;
    hud.mouseController = args.mouseController;
  }

  return entities;
};

export default HUD;