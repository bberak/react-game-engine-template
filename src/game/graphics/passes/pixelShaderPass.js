import * as THREE from 'three';
import ShaderPass from "./shaderPass";
import PixelShader from "../shaders/pixelShader";

export default ({ width, height, pixelSize}) => {
	const pixelPass = new ShaderPass(PixelShader);
	
    pixelPass.uniforms.resolution.value = new THREE.Vector2(width, height);
    pixelPass.uniforms.pixelSize.value = pixelSize;

    return pixelPass;
}