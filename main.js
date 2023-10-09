import * as THREE from 'three';
import {
    MapControls
} from './libs/OrbitControls.js';
import {
    drawInstances
} from './src/draw.js';

let camera, scene, renderer, controls;

init();
render();

// Helper functions

function rndRange(min, max) {
    return min + Math.random() * (max - min);
}

function generateCubes(side) {
    let elements = [];
    for (let x = 0; x < side; x++) {
        for (let y = 0; y < side; y++) {
            elements.push({
                position: new THREE.Vector3(
                    x - side/2,
                    Math.sin(x + y),
                    y - side/2
                ),
                quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(
                    x,
                    y,
                    x + y
                )),
                scale: new THREE.Vector3(
                    rndRange(0.2, 0.8),
                    rndRange(0.2, 0.8),
                    rndRange(0.2, 0.8)
                ),
                color: new THREE.Color(
                    rndRange(0, 1),
                    rndRange(0, 1),
                    rndRange(0, 1)
                ),
            });
        }
    }
    return elements;
}

// Initialise scene

function init() {
    // Setup renderer
    renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const container = document.getElementById('container');
    container.appendChild(renderer.domElement);


    // Setup scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(2, 2, 10);

    // Setup lights
    const hemiLight = new THREE.HemisphereLight();
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Add x-y-z axis indicator
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Draw 500*500 instanced cubes
    const elements = generateCubes(500);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cubes = drawInstances(geometry, elements, THREE.MeshLambertMaterial)
    scene.add(cubes);

    // And camera controls
    controls = new MapControls(camera, renderer.domElement);
    controls.addEventListener('change', render);

    // Update camera aspect ratio on window resize
    window.addEventListener('resize', onWindowResize);

    render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function render() {
    renderer.render(scene, camera);
}