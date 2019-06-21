import ShaderPass from "./shaderPass";
import SepiaShader from "../shaders/sepiaShader";

export default ({ amount = 1.0 } = {}) => {
	const sepiaPass = new ShaderPass(SepiaShader);
	
    sepiaPass.uniforms.amount.value = amount;

    return sepiaPass;
}