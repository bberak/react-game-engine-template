import { allKeys, remove } from "../utils";

const Streak = (entities, { events }) => {

	const streaks = allKeys(entities, e => e.streak, e => e.model);

	streaks.forEach(key => {

		const entity = entities[key]
		const targetId = entity.streak.targetId
		const target =  entities[targetId]

		if (target && target.model) {
			const pos = target.model.position;
			const rot = target.model.rotation;

			if (entity.streak.translateHead)
				entity.streak.translateHead(pos, rot);
			
			if (events.find(x => x.type === "input" && ["left", "right", "swipe-left", "swipe-right"].indexOf(x.control) !== -1 && x.entityId === targetId) && entity.streak.addPoint)
				entity.streak.addPoint(pos, rot);

			if (entity.streak.update)
				entity.streak.update(target);
		} else {
			remove(entities, key)
		}
	})


	return entities;
}

export default Streak;