import React from "react";

class HUDRenderer extends React.Component {
  shouldComponentUpdate(nextProps) {
    const k1 = this.props.keyController || {};
    const k2 = nextProps.keyController || {};

    const s1 = this.props.gamepadController || {};
    const s2 = nextProps.gamepadController || {};

    const m1 = this.props.mouseController || {};
    const m2 = nextProps.mouseController || {};

    return (
      k1.w !== k2.w ||
      k1.a !== k2.a ||
      k1.s !== k2.s ||
      k1.d !== k2.d ||
      s1.leftTrigger !== s2.leftTrigger ||
      s1.rightTrigger !== s2.rightTrigger ||
      s1.leftStick.x !== s2.leftStick.x ||
      s1.leftStick.y !== s2.leftStick.y ||
      s1.rightStick.x !== s2.rightStick.x ||
      s1.rightStick.y !== s2.rightStick.y ||
      m1.wheel !== m2.wheel ||
      m1.left !== m2.left ||
      m1.right !== m2.right ||
      m1.middle !== m2.middle ||
      m1.position.x !== m2.position.x ||
      m1.position.y !== m2.position.y
    );
  }

  render() {
    const { w, a, s, d } = this.props.keyController || {};
    const { leftTrigger, rightTrigger, leftStick = { x: 0, y: 0 }, rightStick = { x: 0, y: 0 } } = this.props.gamepadController || {};
    const { wheel, left, middle, right, position = { x: 0, y: 0 } } = this.props.mouseController || {};
    const onColor = "cornflowerblue";
    const offColor = "white"

    return (
      <div style={css.hud}>
        <h1>
          <span style={{ color: offColor }}>{`(${leftStick.x.toFixed(2)}, ${leftStick.y.toFixed(2)})`}</span>
          &nbsp;&nbsp;
          <span style={{ color: leftTrigger ? onColor : offColor }}>LT</span>
          &nbsp;&nbsp;
          <span style={{ color: w ? onColor : offColor }}>W</span>
          <span style={{ color: a ? onColor : offColor }}>A</span>
          <span style={{ color: s ? onColor : offColor }}>S</span>
          <span style={{ color: d ? onColor : offColor }}>D</span>
          &nbsp;&nbsp;
          <span style={{ color: rightTrigger ? onColor : offColor }}>RT</span>
          &nbsp;&nbsp;
          <span style={{ color: offColor }}>{`(${rightStick.x.toFixed(2)}, ${rightStick.y.toFixed(2)})`}</span>
          &nbsp;&nbsp;
          <span style={{ color: offColor }}>
            MOUSE (
            <span style={{ color: offColor }}>{wheel}</span>
            &nbsp;&nbsp;
            <span style={{ color: left ? onColor : offColor }}>L</span>
            <span style={{ color: middle ? onColor : offColor }}>M</span>
            <span style={{ color: right ? onColor : offColor }}>R</span>
            &nbsp;&nbsp;
            <span style={{ color: offColor }}>{`${position.x}, ${position.y}`}</span>
            )
          </span>
        </h1>
      </div>
    );
  }
}

const css = {
  hud: {
    zIndex: 100,
    marginTop: -100
  }
}

export default () => {
  return { renderer: <HUDRenderer /> };
};
