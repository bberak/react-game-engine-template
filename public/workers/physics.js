importScripts("../assets/scripts/ammo.wasm.js");

Ammo().then(init);

function init() {
	let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
		dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
		overlappingPairCache = new Ammo.btDbvtBroadphase(),
		solver = new Ammo.btSequentialImpulseConstraintSolver();

	world = new Ammo.btDiscreteDynamicsWorld(
		dispatcher,
		overlappingPairCache,
		solver,
		collisionConfiguration
	);

	world.setGravity(new Ammo.btVector3(0, -20, 0));

	postMessage({ name: "ready" });

	let bodyCache = {};
	let contactCache = {};

	function toBtVec(v) {
		return new Ammo.btVector3(v.x, v.y, v.z);
	}

	function toBtQuat(v) {
		let yaw = v.y,
			pitch = v.x,
			roll = v.z;
		return new Ammo.btQuaternion(yaw, pitch, roll, 1);
	}

	function configure(data) {
		world.setGravity(toBtVec(data.gravity));
	}

	function addBodies(data) {
		data.bodies.filter(x => !x.constraint).forEach(function(body) {
			let transform = new Ammo.btTransform();
	    	let shapeName = body.shape || "btBoxShape";
	    	let position = toBtVec(body.position || { x: 0, y: 0, z: 0 });
	    	let scale = toBtVec(body.scale || body.size || { x: 0, y: 0, z: 0 });
	    	let rotation = toBtQuat(body.rotation || { x: 0, y: 0, z: 0 });
	    	let radius = body.radius || 0;
    		let mass = body.mass || 0;
    		let margin = body.margin == undefined ? 0.05 : body.margin;
    		let friction = body.friction == undefined ? 0.4 : body.friction;
    		let restitution = body.restitution == undefined ? 0.2 : body.restitution;
    		let linearDamping = body.linearDamping || 0;
    		let angularDamping = body.angularDamping || 0;
    		let rollingFriction = body.rollingFriction || 0;
    		let localInertia = toBtVec(body.localInertia || { x: 0.1, y: 0.1, z: 0.1 })
    		let linearFactor = toBtVec(body.linearFactor || { x: 1, y: 1, z: 1 });
    		let angularFactor = toBtVec(body.angularFactor || { x: 1, y: 1, z: 1});
    		let constructorArgs = body.constructorArgs || "scale";	
    		let linearSleepingThreshold = body.linearSleepingThreshold == undefined ? 0.5 : body.linearSleepingThreshold;
    		let angularSleepingThreshold = body.angularSleepingThreshold == undefined ? 0.5 : body.angularSleepingThreshold;
    		let collisionGroup = body.collisionGroup == undefined ? 1 : body.collisionGroup;
    		let collisionMask = body.collisionMask == undefined ? 1 : body.collisionMask;

    		transform.setIdentity();
			transform.setOrigin(position);
	    	transform.setRotation(rotation);

	    	let motionState = new Ammo.btDefaultMotionState(transform);
			let shape = eval(`new Ammo.${shapeName}(${constructorArgs})`);
    		
    		shape.setMargin(margin);
		    shape.calculateLocalInertia(mass, localInertia);

		    let rigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);

		    rigidBodyInfo.set_m_friction(friction);
            rigidBodyInfo.set_m_restitution(restitution);
            rigidBodyInfo.set_m_linearDamping(linearDamping);
            rigidBodyInfo.set_m_angularDamping(angularDamping);
            rigidBodyInfo.set_m_rollingFriction(rollingFriction);

		    let rigidBody = new Ammo.btRigidBody(rigidBodyInfo);

		    rigidBody.id = body.id;
		    rigidBody.index = body.index;
		    rigidBody.name = body.name;
		    rigidBody.setLinearFactor(linearFactor);
		    rigidBody.setAngularFactor(angularFactor);
		    rigidBody.setSleepingThresholds(linearSleepingThreshold, angularSleepingThreshold)

    		world.addRigidBody(rigidBody, collisionGroup, collisionMask);
    		bodyCache[body.id] = rigidBody;
		})

		data.bodies.filter(x => x.constraint).forEach(function(body) {
	    	let typeName = body.type || "btHingeConstraint";
	    	let bodyA = bodyCache[body.bodyA];
	    	let bodyB = bodyCache[body.bodyB];
	    	let pivotInA = toBtVec(body.pivotInA || { x: 0, y: 0, z: 0 });
	    	let pivotInB = toBtVec(body.pivotInB || { x: 0, y: 0, z: 0 });
	    	let axisInA = toBtVec(body.axisInA || { x: 0, y: 0, z: 0 });
	    	let axisInB = toBtVec(body.axisInB || { x: 0, y: 0, z: 0 });
	    	let useReferenceFrameA = body.useReferenceFrameA || false;
	    	let disableCollisionsBetweenLinkedBodies = body.disableCollisionsBetweenLinkedBodies || true;
    		let lowerLimit = body.lowerLimit || 0;
    		let upperLimit = body.upperLimit || 0;
    		let softness = body.softness || 0.9;
    		let biasFactor = body.biasFactor || 0.3;
    		let relaxationFactor = body.relaxationFactor || 1.0;
    		let constructorArgs = body.constructorArgs || "bodyA";

			let constraint = eval(`new Ammo.${typeName}(${constructorArgs})`);

    		constraint.id = body.id;
		    constraint.index = body.index;
		    constraint.name = body.name;
		    constraint.constraint = body.constraint;

		    if (constraint.setLimit)
		    	constraint.setLimit(lowerLimit, upperLimit, softness, biasFactor, relaxationFactor);

    		world.addConstraint(constraint, disableCollisionsBetweenLinkedBodies);	
    		bodyCache[body.id] = constraint;
		});
	}

	function removeBodies(data) {
		data.ids.forEach(function(id) {
			let body = bodyCache[id];

			if (body) {
				if (body.constraint)
					world.removeConstraint(body);
				else
					world.removeRigidBody(body);

				delete bodyCache[id]
			}

		})
	}

	function clearBodies(data) {
		Object.keys(bodyCache).forEach(function(id) {
			let body = bodyCache[id];

			if (body.constraint)
				world.removeConstraint(body);
			else
				world.removeRigidBody(body);

			delete bodyCache[id]
		})

		contactCache = {};
	}

	function functionCalls(data) {
		data.functionCalls.forEach(function(call) {
			let body = bodyCache[call.id];
			let args = Array.isArray(call.args) ? call.args : [call.args];

			if (body) 
				body[call.functionName].apply(body, call.args.map(toBtVec));
		})
	}

	function simulate(data) {
		world.stepSimulation(data.timeDelta, 6);

		let updates = [];
		let transform = new Ammo.btTransform();

		Object.keys(bodyCache).forEach(function(id) {
			let body = bodyCache[id];

			if (body.constraint)
				return;

			body.getMotionState().getWorldTransform(transform);

			let origin = transform.getOrigin(),
				rotation = transform.getRotation(),
				linearVelocity = body.getLinearVelocity(),
				angularVelocity = body.getAngularVelocity();

			updates.push({
				id: body.id,
				index: body.index,
				name: body.name,
				position: { x: origin.x(), y: origin.y(), z: origin.z() },
				rotation: {
					x: rotation.x(),
					y: rotation.y(),
					z: rotation.z(),
					w: rotation.w(),
				},
				velocity: { x: linearVelocity.x(), y: linearVelocity.y(), z: linearVelocity.z() },
				angularVelocity: { x: angularVelocity.x(), y: angularVelocity.y(), z: angularVelocity.z() }
			});
		})

	    let num = dispatcher.getNumManifolds();
	    let beginContacts = [];
	    let endContacts = [];
	    let temp = {};

		for (let i = 0; i < num; i++) {
		    let manifold = dispatcher.getManifoldByIndexInternal(i);
		    let numContacts = manifold.getNumContacts();
		    
		    if (numContacts === 0)
		        continue;

		    for (let j = 0; j < numContacts; j++) {
		        let pt = manifold.getContactPoint(j);
		        let body1 = Ammo.castObject(manifold.getBody0(), Ammo.btRigidBody);
		        let body2 = Ammo.castObject(manifold.getBody1(), Ammo.btRigidBody);
		        let force = pt.getAppliedImpulse();  
		        let wpa = pt.getPositionWorldOnA();
		        let worldPositionOnA = { x: wpa.x(), y: wpa.y(), z: wpa.z() };
		        let wpb = pt.getPositionWorldOnB();
		        let worldPositionOnB = { x: wpb.x(), y: wpb.y(), z: wpb.z() };
		        let wnb = pt.get_m_normalWorldOnB();
		        let worldNormalOnB = { x: wnb.x(), y: wnb.y(), z: wnb.z() };
		        let contact = { body1: body1.id, body2: body2.id, force, worldPositionOnA, worldPositionOnB, worldNormalOnB };
		        let key = [body1.id, body2.id].sort().join("><");

		        if (!contactCache[key])
		        	beginContacts.push(contact);

		        contactCache[key] = contact;
		        temp[key] = true;
		    }
		}

		Object.keys(contactCache).forEach(function (key) {
			if (!temp[key]) {
				endContacts.push(contactCache[key])
				delete contactCache[key]
			}
		})

		postMessage({ name: "sync", bodies: updates, beginContacts, endContacts });
	}

	onmessage = function(e) {		
		const handler = [
			configure,
			addBodies,
			removeBodies,
			clearBodies,
			functionCalls,
			simulate
		].find((x) => x.name == e.data.name);

		handler(e.data);
	};
}