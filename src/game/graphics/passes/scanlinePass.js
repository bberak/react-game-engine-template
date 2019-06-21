import ShaderPass from "./shaderPass";
import Scanline from "../shaders/scanline";

export default () => {
	return new ShaderPass(Scanline);
}