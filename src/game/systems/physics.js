import { allKeys } from "../utils";
import { subscribe, send } from "../utils/physics";

const events = [];

const queuePhysicsEvent = (e) => {
  events.push(e.data);
}

const processEvents = (bodies, entities, args) => {
  events.forEach((e) => {
    if (e.name === "sync") {
      e.bodies.forEach(b => {
        const entity = bodies[b.id]
        if (entity)
          entity.physics.sync(entity, b);
      });

      e.beginContacts.forEach(c => {
        const entity1 = bodies[c.body1];
        const entity2 = bodies[c.body2];

        if (entity1 && entity2) {
          if (entity1.physics.beginContact)
          entity1.physics.beginContact(entity1, entity2, c, entities, args);

          if (entity2.physics.beginContact)
            entity2.physics.beginContact(entity2, entity1, c, entities, args);
        }
      });

      e.endContacts.forEach(c => {
        const entity1 = bodies[c.body1];
        const entity2 = bodies[c.body2];

        if (entity1 && entity2) {
          if (entity1.physics.endContact)
          entity1.physics.endContact(entity1, entity2, c, entities, args);

          if (entity2.physics.endContact)
            entity2.physics.endContact(entity2, entity1, c, entities, args);
        }
      });
    }
  });

  events.length = 0;
};

const Physics = (entities, args) => {
  subscribe(queuePhysicsEvent)
  
  const entitiesWithPhysics = allKeys(entities, (e) => e.physics);
  const bodies = {};

  entitiesWithPhysics.forEach(key => {
    const entity = entities[key];

    entity.physics.bodies.forEach(b => bodies[b.id] = entity)
  })

  processEvents(bodies, entities, args);
  send(args.time.delta);

  return entities;
};

export default Physics;
