const readButton = (input, buttons, name) => input.find(x => x.name === name && buttons.indexOf(x.payload.button) !== -1);

const createButtonReader = buttons => {
  let down = false;

  return input => {
    if (readButton(input, buttons, "onMouseDown"))
      down = true;
    
    if (readButton(input, buttons, "onMouseUp"))
      down = false;

    return down;
  }
};

const createPositionReader = () => {
  let position = { x: 0, y: 0 };

  return input => {
    const move = input.find(x => x.name === "onMouseMove");

    if (move) {
      position = {
        x: move.payload.pageX,
        y: move.payload.pageY
      }
    }

    return position;
  }
}

const createWheelReader = () => {
  let value = 0;

  return input => {
    const wheel = input.find(x => x.name === "onWheel");

    if (wheel) {
      if (wheel.payload.deltaY < 0)
        value--;
      else 
        value++;
    }

    return value;
  }
}

const left = createButtonReader([0]);
const middle = createButtonReader([1]);
const right = createButtonReader([2]);
const position = createPositionReader();
const wheel = createWheelReader();

let previous = { };

const MouseController = (Wrapped = x => x) => (entities, args) => {

  if (!args.mouseController) {
      const input = args.input;

      const current = {
        left: left(input),
        middle: middle(input),
        right: right(input),
        position: position(input),
        wheel: wheel(input)
      };

      args.mouseController = Object.assign({}, current, { previous });

      previous = current;
  }

  return Wrapped(entities, args);
};

export default MouseController;