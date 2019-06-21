import React, { Component } from "react";

class Block extends Component {
	render() {
		const pos = this.props.position;
		return (
			<div style={{ ...css.container, ...{ left: pos.x - 25, top: pos.y - 25 } }} />
		);
	}
}

const css = {
	container: {
		width: 50,
		height: 50,
		position: "absolute",
		left: 0,
		top: 0,
		backgroundColor: "blue"
	}
};

export default () => {
	return { position: { x: 0, y: 0 }, renderer: Block };
};
