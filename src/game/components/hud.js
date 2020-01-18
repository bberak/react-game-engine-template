import React from "react";

class HUDRenderer extends React.Component {
  shouldComponentUpdate(nextProps) {
    const k1 = this.props.keyboardController || {};
    const k2 = nextProps.keyboardController || {};

    const g1 = this.props.gamepadController || {};
    const g2 = nextProps.gamepadController || {};

    const m1 = this.props.mouseController || {};
    const m2 = nextProps.mouseController || {};

    return (
      k1.w !== k2.w ||
      k1.a !== k2.a ||
      k1.s !== k2.s ||
      k1.d !== k2.d ||
      k1.space !== k2.space ||
      k1.control !== k2.control ||
      g1.leftTrigger !== g2.leftTrigger ||
      g1.rightTrigger !== g2.rightTrigger ||
      g1.leftStick.x !== g2.leftStick.x ||
      g1.leftStick.y !== g2.leftStick.y ||
      g1.rightStick.x !== g2.rightStick.x ||
      g1.rightStick.y !== g2.rightStick.y ||
      g1.button0 !== g2.button0 ||
      g1.button1 !== g2.button1 ||
      m1.wheel !== m2.wheel ||
      m1.left !== m2.left ||
      m1.right !== m2.right ||
      m1.middle !== m2.middle ||
      m1.position.x !== m2.position.x ||
      m1.position.y !== m2.position.y
    );
  }

  render() {
    const { w, a, s, d, space, control } = this.props.keyboardController || {};
    const {
      button0,
      button1,
      leftTrigger = 0,
      rightTrigger = 0,
      leftStick = { x: 0, y: 0 },
      rightStick = { x: 0, y: 0 }
    } = this.props.gamepadController || {};
    const { wheel, left, middle, right, position = { x: 0, y: 0 } } =
      this.props.mouseController || {};
    const onColor = "cornflowerblue";
    const offColor = "white";

    return (
      <div style={css.hud}>
        <h1>
          <span style={{ color: button0 ? onColor : offColor }}>B0</span>
          &nbsp;&nbsp; 
          <span style={{ color: button1 ? onColor : offColor }}>B1</span>
          &nbsp;&nbsp;
          <span style={{ color: leftStick.heading ? onColor : offColor }}>{`LS(${leftStick.x.toFixed(2)}, ${leftStick.y.toFixed(2)})`}</span>
          &nbsp;&nbsp;
          <span style={{ color: leftTrigger ? onColor : offColor }}>{`LT(${leftTrigger.toFixed(2)})`}</span>
          &nbsp;&nbsp;
          <span style={{ color: rightStick.heading ? onColor : offColor }}>{`RS(${rightStick.x.toFixed(2)}, ${rightStick.y.toFixed(2)})`}</span>
          &nbsp;&nbsp;
          <span style={{ color: rightTrigger ? onColor : offColor }}>{`RT(${rightTrigger.toFixed(2)})`}</span>
          &nbsp;&nbsp;
          <span style={{ color: w ? onColor : offColor }}>W</span>
          <span style={{ color: a ? onColor : offColor }}>A</span>
          <span style={{ color: s ? onColor : offColor }}>S</span>
          <span style={{ color: d ? onColor : offColor }}>D</span>
          &nbsp;&nbsp;
          <span style={{ color: space ? onColor : offColor }}>SPACE</span>
          &nbsp;&nbsp;
          <span style={{ color: control ? onColor : offColor }}>CONTROL</span>
          &nbsp;&nbsp;
          <span>
            MOUSE(
            <span>{wheel}</span>
            &nbsp;&nbsp;
            <span style={{ color: left ? onColor : offColor }}>L</span>
            <span style={{ color: middle ? onColor : offColor }}>M</span>
            <span style={{ color: right ? onColor : offColor }}>R</span>
            &nbsp;&nbsp;
            <span>{`${position.x}, ${position.y}`}</span>
            )
          </span>
        </h1>
      </div>
    );
  }
}

const css = {
  hud: {
    fontSize: 10,
    color: "white",
    zIndex: 100,
    marginTop: -100
  }
}

export default () => {
  return { renderer: <HUDRenderer /> };
};
