const getGamepad = () => navigator.getGamepads()[0] || navigator.getGamepads()[1] || navigator.getGamepads()[2] || navigator.getGamepads()[3];

const vibrate = gp => {
  return effect => {
    if (gp && gp.vibrationActuator)
      gp.vibrationActuator.playEffect("dual-rumble", effect);
  };
};

const createGamepadButtonReader = (buttonIndices = []) => {
  return gp => {
    if (gp) {
      return buttonIndices.map(idx => gp.buttons[idx].pressed);
    }
  }
};

const createGamepadButtonValueReader = (buttonIndices = [], threshold = 0.05) => {
  return gp => {
    if (gp) {
      return buttonIndices.map(idx => {
        const button = gp.buttons[idx];

        return button.pressed && button.value > threshold ? button.value : 0;
      });
    }
  }
};

const createGamepadAxesReader = (axisIndices = [], mapper = x => x, threshold = 0.05) => {
  return gp => {
    if (gp) {
      return axisIndices.map(idx => {
        const val = gp.axes[idx];

        return Math.abs(val) > threshold ? val : 0;
      })
    }
  }
};

const stick = (xIdx, yIdx) => {
  const reader = createGamepadAxesReader([xIdx, yIdx]);

  return gp => {
    const [x, y] = reader(gp) || [0, 0];

    return { x, y, heading: (x + y) ? Math.atan2(y, x) : null };
  }
};

const button = (idx) => {
  const reader = createGamepadButtonReader([idx]);

  return gp => {
    const [val] = reader(gp) || [false];

    return val;
  }
};

const buttonValue = (idx) => {
  const reader = createGamepadButtonValueReader([idx]);

  return gp => {
    const [val] = reader(gp) || [0];

    return val;
  }
};

const leftStick = stick(0, 1);
const rightStick = stick(2, 3);
const button0 = button(0);
const button1 = button(1);
const leftTrigger = buttonValue(6);
const rightTrigger = buttonValue(7);

let previous = { };

const GamepadController = (Wrapped = x => x) => (entities, args) => {

  if (!args.gamepadController) {
      const gamepad = getGamepad();

      const current = {
        leftStick: leftStick(gamepad),
        rightStick: rightStick(gamepad),
        button0: button0(gamepad),
        button1: button1(gamepad),
        leftTrigger: leftTrigger(gamepad),
        rightTrigger: rightTrigger(gamepad),
        vibrate: vibrate(gamepad)
      };

      args.gamepadController = Object.assign({}, current, { previous });

      previous = current;
  }

  return Wrapped(entities, args);
};

export default GamepadController;