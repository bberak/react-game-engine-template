import * as THREE from 'three';

const width = 2000;

const generatePlane = ({ x, y, z }) => {
	const geometry = new THREE.PlaneGeometry(width, width, 1, 1);
	var texture = new THREE.TextureLoader().load("/assets/textures/grid.png");
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(width / 2, width / 2);
	const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.25 });
	const mesh = new THREE.Mesh(geometry, material);

	mesh.position.x = x;
	mesh.position.y = y;
	mesh.position.z = z;
	mesh.rotation.reorder("YXZ");
	mesh.rotation.x = -Math.PI * 0.5;
	mesh.rotation.y = Math.PI * 0.125;

	return mesh
}

export default ({ scene, x = 0, y = 0, z = 0 }) => {
	const hitBox = new THREE.Box3()
	const hitBoxBuffer = new THREE.Vector3()
	const hitBoxOffset = new THREE.Vector3()
	const mesh = generatePlane({ x, y, z })
	
	scene.add(mesh);

	return { 
		model: mesh, 
		removable: false, 
		collisions: {
			hitBox,
			hitBoxBuffer,
			hitBoxOffset,
			calculateHitBox: _ => {
				hitBox.setFromObject(mesh).expandByVector(hitBoxBuffer).translate(hitBoxOffset)
				return hitBox
			}
		},
		terrain: true,
		focus: true
	}
}