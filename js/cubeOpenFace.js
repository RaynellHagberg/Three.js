/***********
 * cubeOpenFace.js
 * A cube with one open face, orbit control, and light
 * Raynell Hagberg
 * January 2019
 * ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();


function createScene() {
    // box geometry
    var geom = new THREE.Geometry();
    geom.vertices.push(new THREE.Vector3(0, 0, 0.1)); //0
    geom.vertices.push(new THREE.Vector3(5, 0, 0.1)); //1
    geom.vertices.push(new THREE.Vector3(0, 5, 0.1)); //2
    geom.vertices.push(new THREE.Vector3(5, 5, 0.1)); //3
    geom.vertices.push(new THREE.Vector3(0.1, 5, 5)); //4
    geom.vertices.push(new THREE.Vector3(5, 5, 5));   //5
    geom.vertices.push(new THREE.Vector3(0.1, 0, 5)); //6
    geom.vertices.push(new THREE.Vector3(5, 0.1, 5)); //7

    var face1 = new THREE.Face3(0, 1, 2);
    geom.faces.push(face1);
    var face2 = new THREE.Face3(1, 2, 3);
    geom.faces.push(face2);
    var face3 = new THREE.Face3(2, 3, 4);
    geom.faces.push(face3);
    var face4 = new THREE.Face3(3, 4, 5);
    geom.faces.push(face4);
    var face5 = new THREE.Face3(0, 1, 7);
    geom.faces.push(face5);
    var face6 = new THREE.Face3(0, 6, 7);
    geom.faces.push(face6);
    var face7 = new THREE.Face3(1, 3, 7);
    geom.faces.push(face7);
    var face8 = new THREE.Face3(3, 5, 7);
    geom.faces.push(face8);
    var face9 = new THREE.Face3(0, 2, 4);
    geom.faces.push(face9);
    var face10 = new THREE.Face3(0, 6, 4);
    geom.faces.push(face10);


    //face normals and vertex normals 
    geom.computeFaceNormals();
    //geom.computeVertexNormals();

    // material
    var material = new THREE.MeshLambertMaterial({ color: 0xFF0000, side: THREE.DoubleSide });
     
    //  mesh
    var mesh = new THREE.Mesh(geom, material);

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

