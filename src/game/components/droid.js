import { promisifyLoader } from "../utils/three";
import FBXLoader from "../utils/three/fbx-loader";
import AnimatedModel from "./animated-model";
import DroidFile from "../../assets/models/droid.fbx";

const loader = promisifyLoader(new FBXLoader());
const mesh = loader.load(DroidFile);

export default async ({ parent, x = 0, y = 0, z = 0}) => {

	const animated = await AnimatedModel({ parent, x, y, z, mesh, scale: 0.0035 })

	return animated;
};
