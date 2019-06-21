import { all } from "../utils";
import _ from "lodash";

const Rotation = (entities, args) => {
	const rotatables = all(entities, e => e.rotation, e => e.model);

	for (let i = 0; i < rotatables.length; i++) {
		const r = rotatables[i];

		if (r.model.isSprite) {
			r.model.material.rotation = _.isFunction(r.rotation)
				? r.rotation(r, entities, args)
				: r.model.material.rotation + r.rotation;
		} else {
			r.model.rotation.z = r.rotation.roll
				? _.isFunction(r.rotation.roll)
					? r.rotation.roll(r, entities, args)
					: r.model.rotation.z + r.rotation.roll
				: r.model.rotation.z;
			r.model.rotation.x = r.rotation.pitch
				? _.isFunction(r.rotation.pitch)
					? r.rotation.pitch(r, entities, args)
					: r.model.rotation.x + r.rotation.pitch
				: r.model.rotation.x;
			r.model.rotation.y = r.rotation.yaw
				? _.isFunction(r.rotation.yaw)
					? r.rotation.yaw(r, entities, args)
					: r.model.rotation.y + r.rotation.yaw
				: r.model.rotation.y;
		}
	}

	return entities;
};

export default Rotation;
