import * as THREE from 'three';
import ShaderPass from "./shaderPass";
import SobelShader from "../shaders/sobelOperatorShader";

export default ({ width, height }) => {
	const sobelPass = new ShaderPass(SobelShader);
	
    sobelPass.uniforms.resolution.value = new THREE.Vector2(width, height);

    return sobelPass;
}