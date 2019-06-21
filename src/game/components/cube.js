import * as THREE from 'three';

export default ({ scene }) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: '#433F81'     })
    const cube = new THREE.Mesh(geometry, material)
    
    scene.add(cube)

	return { model: cube, rotation: { yaw: 0.01, pitch: 0.01} };
};
