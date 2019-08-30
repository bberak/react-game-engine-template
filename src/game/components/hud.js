import React from "react";

class HUDRenderer extends React.Component {
  shouldComponentUpdate(nextProps) {
    const s1 = this.props.stickController || {};
    const s2 = nextProps.stickController || {};

    return Boolean(s1.x || s1.y) !== Boolean(s2.x || s2.y) || s1.a !== s2.a || s1.b !== s2.b;
  }

  render() {
    // const {
    //   stickRadius = 0,
    //   stickPosition = { x: 0, y: 0 },
    //   aRadius = 0,
    //   aPosition = { x: 0, y: 0 },
    //   bRadius = 0,
    //   bPosition = { x: 0, y: 0 },
    //   a = false,
    //   b = false,
    //   x = 0,
    //   y = 0
    // } = this.props.stickController || {};

    // const usingStick = x || y;

    return [
      <div key={"stick"}><h1>THIS IS A HUD</h1></div>
    ];
  }
}


export default () => {
  return { renderer: <HUDRenderer /> };
};
