import * as THREE from "three";
import GPUParticleSystem from "../../graphics/gpu-particle-system";
import { add, promisifyLoader } from "../../utils/three";

const loader = promisifyLoader(new THREE.TextureLoader());
const _noiseTexture = loader.load("./assets/textures/perlin.png");

export default async ({
	maxParticles = 250,
	noiseTexture,
	particleTexture,
	parent,
	options = {},
	spawnOptions = {},
	beforeSpawn = () => {}
}) => {
	const emitter = new GPUParticleSystem({
		maxParticles,
		particleNoiseTex: await Promise.resolve(noiseTexture || _noiseTexture),
		particleSpriteTex: await Promise.resolve(particleTexture)
	});

	add(parent, emitter);

	return {
		emitter,
		options,
		spawnOptions,
		beforeSpawn,
		tick: 0
	};
};
