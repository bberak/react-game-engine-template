import * as THREE from 'three';
import  { Player, Platform, Bomber } from "./components";
import { clean } from "./utils/three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 1000);

export default async () => {
	clean(scene);
	const ambient = new THREE.AmbientLight(0xffffff, 0.3)
	const sunlight = new THREE.DirectionalLight(0xffffff, 0.5);
	const player = await Player({ scene, y: 1 });

    sunlight.position.set(0, 50, 0);

    scene.add(ambient)
    scene.add(sunlight)

	camera.position.set(0, 8, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.animations = {}
    camera.physics = {
    	mass: 12.5,
		maxSpeed: 0.75,
		forces: new THREE.Vector3(),
		acceleration: new THREE.Vector3(),
		velocity: new THREE.Vector3(),
		position: camera.position,
		damping: 0.1
    };
    camera.spring = {
    	anchor: player.model.position,
		length: 1,
		k: 0.055,
		subtract: (position, anchor) => {
			return new THREE.Vector3(position.x - anchor.x, 0, position.z - anchor.z)
		}
    };

	const entities = {
		scene,
		camera,
		player,

		platform1: Platform({ scene, source: true, destination: false, y: 1, z: -2, x: -0.75, yaw: 0.2, height: 0.5 }),
		platform2: Platform({ scene, source: false, destination: true, y: 1, z: -7, x: 0.95, yaw: -0.2, height: 0.5 }),
		platform3: Platform({ scene, source: true, destination: false, y: 1, z: -13, x: -0.65, yaw: 0.5, height: 0.5 }),
		platform4: Platform({ scene, source: false, destination: true, y: 1, z: -18, x: 0.85, height: 0.5 }),
		platform5: Platform({ scene, source: true, destination: false, y: 1, z: -23, x: -0.72, yaw: 0.15, height: 0.5 }),
		platform6: Platform({ scene, source: false, destination: true, y: 1, z: -28, x: 0.85, yaw: -0.3, height: 0.5 }),

		b1: await Bomber({ scene, y: 2 })
	};

	return entities;
};
