/***********
 * cylinder.js
 * A function to render an n-sided open cylinder with ability to add top and bottom faces
 * Raynell Hagberg
 * February 2019
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();


function createCylinder(n, len, rad, isCappedBottom, isCappedTop) {
    if (isCappedBottom === undefined) isCappedBottom = false;
    if (isCappedTop === undefined) isCappedTop = false;
    var len2 = len / 2;
    var geom = new THREE.Geometry();
    // push 2*n + 2 vertices
    var inc = 2 * Math.PI / n;

    for (var i = 0, a = 0; i <= n; i++, a += inc) {
        var cos = Math.cos(a);
        var sin = Math.sin(a);
        bottomVertex = new THREE.Vector3(rad * cos, -len2, rad * sin);
        topVertex = new THREE.Vector3(rad * cos, len2, rad * sin);
        geom.vertices.push(bottomVertex, topVertex);
    }
    // push 2*n side faces (each of the n rectangular side faces
    // is constructed from 2 triangles)
    for (var i = 2; i < 2 * n; i += 2) {
        geom.faces.push(new THREE.Face3(i - 2, i - 1, i)); // 
        geom.faces.push(new THREE.Face3(i - 1, i + 1, i));
    }

    // close cylinder
    geom.faces.push(new THREE.Face3(0, 1, i - 2)); // 0, 1, 0
    geom.faces.push(new THREE.Face3(1, i - 2, i - 1)); // 1, 0, 1

    if (isCappedTop)
        for (i = 0; i < n - 2; i++)
            geom.faces.push(new THREE.Face3(0, 2 * i + 2, 2 * i + 4)); // 0, 2, 4
    if (isCappedBottom)                                                // 0, 4, 6
        for (i = 0; i < n - 2; i++)
            geom.faces.push(new THREE.Face3(2 * i + 5, 2 * i + 3, 1)); // 5, 3, 1
                                                                       // 7, 5, 1 

    geom.computeFaceNormals();

    return geom;
}

function createScene() {
    var geom = createCylinder(12, 6, 2, true, true); // default for isCappedBottom and isCappedTop is false
    // material
    var mat = new THREE.MeshLambertMaterial({ color: "blue", shading: THREE.FlatShading, side: THREE.DoubleSide });

    // create mesh
    var mesh = new THREE.Mesh(geom, mat);

    // lights
    var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
    light.position.set(10, 15, 10);
    var light2 = new THREE.PointLight(0xFFFFFF, 1, 1000);
    light2.position.set(-10, -15, -10);
    var ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(light);
    scene.add(light2);
    scene.add(ambientLight);

    scene.add(mesh);
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
    // set the clear color to black
    renderer.setClearColor(0x000000, 1.0);

    // set the camera position and point camera at the target
    var target = new THREE.Vector3(0, 0, 0);
    camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
    camera.position.set(-5, 20, 5);
    camera.lookAt(target);
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target = target;
    cameraControls.center = target;
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

function showGrids() {
    // Grid step size is 1; axes meet at (0,0,0)
    //	Coordinates.drawGrid({size:100,scale:1,orientation:"z"});
    Coordinates.drawAllAxes({ axisLength: 11, axisRadius: 0.05 });
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
    showGrids();
    createScene();
    addToDOM();
    render();
    animate();
} catch (e) {
    var errorMsg = "Error: " + e;
    document.getElementById("msg").innerHTML = errorMsg;
}

