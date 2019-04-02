/***********
 * solarSystem.js
 * An animated solar system with Sun, Earth, and moon
 * Raynell Hagberg
 * March 2019
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();


function makeSatellite(root, node, distance, secondsPerRevolution, angularOffset) {
    node.theta = 0 + angularOffset;
    node.rotate = function (delta) {
        var rotation = 2 * Math.PI / secondsPerRevolution;
        node.theta += (rotation * delta);
        if (node.theta >= 2 * Math.PI)
            node.theta -= 2 * Math.PI;
        node.position.x = root.position.x + distance * Math.cos(node.theta);
        node.position.y = root.position.y + distance * Math.sin(node.theta);
    }
    node.rotate(0);
}

function rotateSatellites(system, delta) {
    for (var i = 0; i < system.children.length; i++) {
        var child = system.children[i];
        if (child.rotate) {
            child.rotate(delta);
        }
        rotateSatellites(child, delta);
    }
}

function createScene() {
    var sunMat = new THREE.MeshBasicMaterial({ color: 'gold' }); // mesh basic material so the sun will be illuminated on all around
    var sunGeom = new THREE.SphereGeometry(10, 20, 20);
    var sun = new THREE.Mesh(sunGeom, sunMat);

    var earthMat = new THREE.MeshLambertMaterial({ color: 'blue' });
    var earthGeom = new THREE.SphereGeometry(2, 20, 20);
    var earth = new THREE.Mesh(earthGeom, earthMat);

    var moonMat = new THREE.MeshLambertMaterial({ color: 'gray' });
    var moonGeom = new THREE.SphereGeometry(1, 20, 20);
    var moon = new THREE.Mesh(moonGeom, moonMat);

    makeSatellite(sun, earth, 30, 8, 0);
    makeSatellite(earth, moon, 4, 2, 0);

    var system = new THREE.Object3D();
    system.add(sun);
    system.add(earth);
    system.add(moon);

    scene.add(system);
}

function render() {
    var delta = clock.getDelta();

    rotateSatellites(scene, delta);

    cameraControls.update(delta);
    renderer.render(scene, camera);
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

function init() {
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 1.0);

    // lights
    var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
    light.position.set(0, 0, 0); // light centered at the origin so it is coming from the sun
    var ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(light);
    scene.add(ambientLight);

    var target = new THREE.Vector3(0, 0, 0);
    camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
    camera.position.set(0, -70, 70);
    camera.lookAt(target);
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target = target;
    cameraControls.center = target;
}

function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length > 0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild(renderer.domElement);
}


try {
    init();
    createScene();
    addToDOM();
    render();
    animate();
} catch (e) {
    var errorMsg = "Error: " + e;
    document.getElementById("msg").innerHTML = errorMsg;
    throw e;
}
