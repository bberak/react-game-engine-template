import React, { PureComponent } from "react";
import * as THREE from 'three';
import EffectComposer  from "./effect-composer";
import RenderPass from "./passes/render-pass";
import _ from "lodash";

//-- https://medium.com/@colesayershapiro/using-three-js-in-react-6cb71e87bdf4
//-- https://medium.com/@summerdeehan/a-beginners-guide-to-using-three-js-react-and-webgl-to-build-a-3d-application-with-interaction-5d7b2c7ca89a
//-- https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL

class ThreeView extends PureComponent {

  componentDidMount() {
    const container = this.refs.container;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = window.devicePixelRatio;

    this.props.camera.resize(width, height, dpr);
    this.renderer = new THREE.WebGLRenderer({ });
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x020202, 1.0);
    this.composer = new EffectComposer(this.renderer);

    const passes = [
      new RenderPass(this.props.scene, this.props.camera),
      ...this.props.passes
    ]

    passes.forEach(p => this.composer.addPass(p))
    passes[passes.length-1].renderToScreen = true;

    window.addEventListener("resize", this.onResize);

    container.appendChild(this.renderer.domElement)
  }
  
  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);

    const container = this.refs.container;
    container.removeChild(this.renderer.domElement)
  }

  onResize = () => {
    const container = this.refs.container;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = window.devicePixelRatio;

    this.props.camera.resize(width, height, dpr);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height);
  };

  render() {
    if (this.composer) {
      this.composer.render();
    } 

    return (
      <div ref={"container"} style={css.container} />
    );
  }
}

const css = {
  container: {
    height: "100vh", 
    width: "100vw",
    overflow: "hidden"
  }
}

const renderHUD = (entities, window) => {
  if (!entities.hud) return null;

  const hud = entities.hud;

  if (typeof hud.renderer === "object")
    return <hud.renderer.type key={"hud"} {...hud} window={window} />;
  else if (typeof hud.renderer === "function")
    return <hud.renderer key={"hud"} {...hud} window={window} />;
};

const ThreeJSRenderer = (...passes) => (entities, window) => {
  if (!entities) return null;
  return [
    <ThreeView
      passes={_.flatten(passes)}
      key={"threeView"}
      scene={entities.scene}
      camera={entities.camera}
    />,
    renderHUD(entities, window)
  ];
};

export default ThreeJSRenderer;
