/***********
 * sphereOfStarbursts.js
 * A sphere of starbursts
 * Raynell Hagberg
 * January 2019
 * ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();


function createScene() {

    var points = new THREE.Geometry();
    
    while (points.vertices.length < 200) { // number of starbursts
        var x = Math.random() * 2 - 1;  // (between -1 and 1)
        var y = Math.random() * 2 - 1;
        var z = Math.random() * 2 - 1;
        if (x * x + y * y + z * z < 1) { // use vector only if length is less than 1
            var pt = new THREE.Vector3(x, y, z);
            points.vertices.push(pt);
            points.colors.push(new THREE.Color(Math.random() * 0xffffff));
        }
    }

    var material = new THREE.PointsMaterial({ vertexColors: true, size: 10, sizeAttenuation: false });
    var mesh = new THREE.Points(points, material);

    // light
    //   args: color, intensity, range (0 if limitless)
    var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
    // var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(-10, 0, 20);
    var ambientLight = new THREE.AmbientLight(0x222222);

    scene.add(light);
    scene.add(ambientLight);
    scene.add(mesh);
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}


function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
}


function init() {
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 1.0);

    camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
    camera.position.set(0, 0, 40);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
}


function showGrids() {
    //Coordinates.drawAllAxes({axisLength:11, axisRadius:0.05});
}


function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length > 0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild(renderer.domElement);
}



init();
showGrids();
createScene();
addToDOM();
render();
animate();
