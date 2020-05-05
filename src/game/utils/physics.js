import { id } from "./index";

export const bodyId = (id => () => id("body"))(id(0));

const worker = new Worker("./workers/physics.js");
const subscribers = [];
const additions = [];
const removals = [];
const functionCalls = [];

let ready = false;

worker.onmessage = (ev) => {
	subscribers.forEach((x) => x(ev));

	if (ev.data.name === "ready" || ev.data.name === "sync")
		ready = true;
};

export const configure = (cfg = {}) => {
	worker.postMessage({ name: "configure", ...cfg });
};

export const addBody = (body, index) => {
	if (!body.id)
		body.id = bodyId();

	if (!body.index)
		body.index = index;

	additions.push(body);

	return body;
}

export const removeBody = (body) => {
	removals.push(body.id);
}

export const clearBodies = () => {
	worker.postMessage({ name: "clearBodies" });
};

export const subscribe = (cb) => {
	if (!subscribers.find((x) => x === cb)) subscribers.push(cb);
};

export const call = (body, functionName, args) => {
	functionCalls.push({ id: body.id, functionName, args });
};

export const send = (timeDelta) => {
	//-- Should probably accumulated the timeDelta first,
	//-- then reset it after posting the 'simulate' event..
	//-- But it works alright as is..

	if (!ready)
		return;

	if (additions.length) {
		worker.postMessage({ name: "addBodies",  bodies: additions });
		additions.length = 0;
	}

	if (removals.length) {
		worker.postMessage({ name: "removeBodies",  ids: removals });
		removals.length = 0;
	}

	if (functionCalls.length) {
		worker.postMessage({ name: "functionCalls",  functionCalls });
		functionCalls.length = 0;
	}

	worker.postMessage({ name: "simulate", timeDelta });

	ready = false;
}