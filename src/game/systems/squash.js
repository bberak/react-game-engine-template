import * as THREE from 'three';
import { spring } from "popmotion";
import _ from "lodash";

const Squash = (entities, { events }) => {
	
	const objects = Object.keys(entities).filter(x => entities[x].squash && entities[x].model).map(x => entities[x])
	const hold = events.find(x => x.type == "hold")
	const letGo = events.find(x => x.type == "let-go")

	if (hold)
		objects.forEach(x => x.squash())

	if (letGo) {
		spring({
			from: _.flatten(objects.map(x => [x.model.scale.x, x.model.scale.y, x.model.scale.z])),
	      	to: _.flatten(objects.map(x => [1, 1, 1])),
	      	stiffness: 150,
	      	damping: 8
	    }).start(values => {
	    	let idx = 0
	    	objects.forEach(x => {
	    		x.model.scale.x = values[idx++]
	    		x.model.scale.y = values[idx++]
	    		x.model.scale.z = values[idx++]
	    	})
	    });
	}


	return entities;
}

export default Squash;