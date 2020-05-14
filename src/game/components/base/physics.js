import * as PhysicsUtils from "../../utils/physics";

export const Body = (args) => ({
	id: PhysicsUtils.bodyId(),
	position: { x: 0, y: 0, z: 0 },
	rotation: { x: 0, y: 0, z:0 },
	velocity: { x: 0, y: 0, z: 0 },
	angularVelocity: { x: 0, y: 0, z: 0 },
	...args,
});

export const Constraint = (args) => ({
	id: PhysicsUtils.bodyId(),
	position: { x: 0, y: 0, z: 0 },
	rotation: { x: 0, y: 0, z:0 },
	velocity: { x: 0, y: 0, z: 0 },
	angularVelocity: { x: 0, y: 0, z: 0 },
	constraint: true,
	...args,
});
export default ({ bodies = [], sync = [], beginContact, endContact }) => {
	const physics = {
		bodies: bodies.map(PhysicsUtils.addBody),
		beginContact, endContact,
		add: (body) => {
			physics.bodies.push(PhysicsUtils.addBody(body))
		},
		clear: () => {
			physics.bodies.forEach(PhysicsUtils.removeBody)
		},
		applyForce: (body, force, relPos) => {
			PhysicsUtils.call(body, "applyForce", [force, relPos]);
		},
		applyImpulse: (body, impulse, relPos) => {
			PhysicsUtils.call(body, "applyImpulse", [impulse, relPos]);
		},
		applyTorque: (body, torque) => {
			PhysicsUtils.call(body, "applyTorque", [torque]);
		},
		applyTorqueImpulse: (body, torque) => {
			PhysicsUtils.call(body, "applyTorqueImpulse", [torque]);
		},
		setLinearVelocity: (body, velocity) => {
			PhysicsUtils.call(body, "setLinearVelocity", [velocity]);
		},
		setAngularVelocity: (body, velocity) => {
			PhysicsUtils.call(body, "setAngularVelocity", [velocity]);
		},
		sync: (self, body) => {
			self.physics.bodies[body.index].position = body.position;
			self.physics.bodies[body.index].rotation = body.rotation;
			self.physics.bodies[body.index].velocity = body.velocity;
			self.physics.bodies[body.index].angularVelocity = body.angularVelocity;

			//-- By convention, if the entity has a model, the rotation and postion of the first
			//-- body is applied to the model
			if (self.model && body.index === 0) {
				self.model.position.set(body.position.x, body.position.y, body.position.z);
				self.model.quaternion.set(
					body.rotation.x,
					body.rotation.y,
					body.rotation.z,
					body.rotation.w
				);
			}

			//-- Designer can provide handlers for each body that is
			//-- part of the physics component
			if (sync[body.index])
				sync[body.index](self, body);
		},
	};

	return physics;
};
