import Zlib from "three/examples/js/libs/inflate.min";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

global.Zlib = Zlib.Zlib;

export default FBXLoader;