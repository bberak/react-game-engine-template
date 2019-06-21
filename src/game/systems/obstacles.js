import { all, first, id, pipe } from "../utils";
import * as THREE from "three";
import Platform, { scale, rotate } from "../components/platform";
import _ from "lodash";

const next = (id => () => id("platform"))(id(2));

let timeOfLastSpawn = 0;

const generate = ({ pos, scene }) => {
	const width = 1.1;
	const gap = 0.6;
	const num = Math.random() * 5;

	return _.range(num).map(slot => {
		return pipe(
			scale(),
			rotate()
		)(
			Platform({
				scene,
				x: pos.x + slot * (width + gap) - Math.trunc(num / 2) * (width + gap),
				y: pos.y,
				z: pos.z,
				scale: 0.01,
				height: 0.5,
				width,
				color: 0xFFFFFF
			})
		);
	});
};

const pos = new THREE.Vector3();

const Obstacles = (entities, { time }) => {
	const diff = time.current - timeOfLastSpawn;
	const gap = 1000 + Math.random() * 4000;

	if (diff > gap) {
		const player = first(entities, e => e.player, e => e.model);
		const platforms = all(entities, e => e.platform, e => e.model);

		if (player) {
			pos.set(
				player.model.position.x,
				player.model.position.y,
				player.model.position.z - 5
			);

			const close = all(
				platforms,
				p => p.model.position.distanceTo(pos) < 5
			).length;

			if (!close) {
				const scene = entities.scene;
				const platforms = generate({ scene, pos });

				platforms.forEach(p => (entities[next()] = p));
				timeOfLastSpawn = time.current;
			}
		}
	}

	return entities;
};

export default Obstacles;
