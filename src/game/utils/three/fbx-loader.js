import Zlib from "three/examples/js/libs/inflate.min";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

global.Zlib = Zlib.Zlib;

console.log(Object.keys(Zlib));

export default FBXLoader;