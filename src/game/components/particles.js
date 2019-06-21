import * as THREE from 'three';
import GPUParticleSystem from "../graphics/particleSystems/gpuParticleSystem";
import Particle from "../../assets/textures/particle2.png";
import Noise from "../../assets/textures/perlin-512.png";

export default ({ particleTexture = Particle, noiseTexture = Noise, scene, options = {}, spawnOptions = {}, beforeSpawn = () => { }, tags = []  }) => {

	const emitter = new GPUParticleSystem({
		maxParticles: 250000,
		particleSpriteTex: new THREE.TextureLoader().load(particleTexture),
		particleNoiseTex: new THREE.TextureLoader().load(noiseTexture)
	});

	if (scene)
		scene.add(emitter);

	return {
		emitter,
		options,
		spawnOptions,
		beforeSpawn,
		tags,
		tick: 0
	};
};
