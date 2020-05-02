import * as THREE from 'three';
import * as ThreeUtils from "./utils/three";
import * as Physics from "./utils/physics";
import Camera from "./components/base/camera";
import Cuphead from "./components/cuphead";
import HUD from "./components/base/hud";
import Turntable from "./components/turntable";
import Droid from "./components/droid";
import Portal from "./components/portal";
import Jet from "./components/jet";

const scene = new THREE.Scene();
const camera = Camera();

Physics.configure({ gravity: { x: 0, y: -0.8, z: 0 }})

export default async () => {
	Physics.clearBodies();
	ThreeUtils.clear(scene);

	const ambient = new THREE.AmbientLight(0xffffff, 1);
	const sunlight = new THREE.DirectionalLight(0xffffff, 0.95);

    sunlight.position.set(50, 50, 50);

    scene.add(ambient);
    scene.add(sunlight);

	camera.position.set(0, 2, 6);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	const cuphead = await Cuphead({ y: 1 });
	const droid = await Droid({ y: 1 });
	const portal = await Portal({ y: 1 });
	const jet = await Jet({ y: 1 });
	
	const turntable = Turntable({ parent: scene, items: [droid, cuphead, portal, jet] });	
	const hud = HUD();

	const entities = {
		scene,
		camera,
		droid,
		cuphead,
		portal,
		jet,
		turntable,
		hud
	}

	return entities;
};
