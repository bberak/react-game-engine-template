import React from "react";

class HUDRenderer extends React.Component {
  shouldComponentUpdate(nextProps) {
    const k1 = this.props.keyController || {};
    const k2 = nextProps.keyController || {};

    return (
      k1.w !== k2.w ||
      k1.a !== k2.a ||
      k1.s !== k2.s ||
      k1.d !== k2.d
    );
  }

  render() {
    const { w, a, s, d } = this.props.keyController || {};

    return (
      <div>
        <h1>
          <span style={{ color: w ? "red" : "black" }}>W</span>
          <span style={{ color: a ? "red" : "black" }}>A</span>
          <span style={{ color: s ? "red" : "black" }}>S</span>
          <span style={{ color: d ? "red" : "black" }}>D</span>
        </h1>
      </div>
    );
  }
}

export default () => {
  return { renderer: <HUDRenderer /> };
};
