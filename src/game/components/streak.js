import * as THREE from 'three';
import { remap } from "../utils";
import _ from "lodash";

export default ({ scene, tail = new THREE.Vector3(), head = new THREE.Vector3(), color = 0xFFFFFF, linewidth = 10, targetId = "", offset = new THREE.Vector3(), numVerts = 20  }) => {

	const geometry = new THREE.Geometry();
	const rest = _.range(numVerts).map(z => tail.clone().lerp(head, z / numVerts));

	geometry.vertices.push(...rest, head);

	const material = new THREE.LineBasicMaterial( { color, linewidth, transparent: true } );
	const line = new THREE.Line(geometry, material);

	line.frustumCulled = false;

	scene.add(line)

	const rotOffset = new THREE.Vector3();

	return {
		model: line,
		streak: {
			targetId,
			translateHead(pos, rot) {
				rotOffset.set(offset.x, offset.y, offset.z);
				rotOffset.applyEuler(rot);

				head.set(pos.x + rotOffset.x, pos.y + rotOffset.y, pos.z + rotOffset.z);

				geometry.verticesNeedUpdate = true;
			},
			addPoint(pos, rot) {
				for (let i = 0; i < rest.length -1; i++) {
					const current = rest[i];
					const next = rest[i + 1];

					current.set(next.x, next.y, next.z);
				}

				const last = rest[rest.length - 1];

				rotOffset.set(offset.x, offset.y, offset.z);
				rotOffset.applyEuler(rot);

				last.set(pos.x + rotOffset.x, pos.y + rotOffset.y, pos.z + rotOffset.z);

				geometry.verticesNeedUpdate = true;
			},
			update(target) {
				if (target.physics && target.physics.maxSpeed) {
					const currentSpeed = target.physics.velocity.length();
					const newOpacity = remap(currentSpeed, 0, target.physics.maxSpeed, 0, 1)
					const newLinewidth = remap(currentSpeed, 0, target.physics.maxSpeed, 10, 20)

					if (newOpacity !== material.opacity) {
						material.opacity = newOpacity;
						material.needsUpdate = true;
					}

					if (newLinewidth !== material.linewidth) {
						material.linewidth = newLinewidth;
						material.needsUpdate = true;
					}
				}
			}
		}
	};
};