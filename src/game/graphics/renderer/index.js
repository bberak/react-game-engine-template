import React, { PureComponent } from "react";
import * as THREE from 'three';
import EffectComposer from "./effectComposer";
import RenderPass from "../passes/renderPass";
import PixelShaderPass from "../passes/pixelShaderPass";
import SepiaPass from "../passes/sepiaPass";
import _ from "lodash";
import SobelPass from "../passes/sobelPass";
//import UnrealBloomPass from "../passes/unrealBloomPass";
//import ScanlinePass from "../passes/scanlinePass";
//import GlitchPass from "../passes/glitchPass";

//-- https://medium.com/@colesayershapiro/using-three-js-in-react-6cb71e87bdf4
//-- https://medium.com/@summerdeehan/a-beginners-guide-to-using-three-js-react-and-webgl-to-build-a-3d-application-with-interaction-5d7b2c7ca89a
//-- https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL

class ThreeView extends PureComponent {

  componentDidMount() {
    const container = this.refs.container;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = window.devicePixelRatio;

    console.log("Create Context: ", width, height, dpr);

    this.props.camera.aspect = width / height;
    this.props.camera.updateProjectionMatrix();

    this.renderer = new THREE.WebGLRenderer({ });
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x020202, 1.0);
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.toneMappingWhitePoint = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //-- Define composer
    this.composer = new EffectComposer(this.renderer);

    //-- Add passes to composer
    const passes = [
      new RenderPass(this.props.scene, this.props.camera),
      new SobelPass({ width, height }),
      new SepiaPass(),
      //new UnrealBloomPass(new THREE.Vector2(width, height), 2, 0.75, 0),
      new PixelShaderPass({ width, height, pixelSize: 4 }),
      //new ScanlinePass(),
      //new GlitchPass(),
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

    console.log("Resize Context: ", width, height, dpr);

    this.props.camera.aspect = width / height;
    this.props.camera.updateProjectionMatrix();
    
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

const ThreeJSRenderer = (...passes) => (state, window) => {
  return (
    <ThreeView
      passes={_.flatten(passes)}
      key={"threeView"}
      scene={state.scene}
      camera={state.camera}
    />
  );
};

export default ThreeJSRenderer;
