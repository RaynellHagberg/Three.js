/***********
 * segmentedCylinder.js
 * A cylinder consisting of multiple segments with colors assigned per segment
 * with ability to add top and bottom faces
 * Raynell Hagberg
 * February 2019
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();


function divColor(index, max) {
    var freq = 2 * Math.PI * index / max;
    var phase120 = 2 * Math.PI / 3;  // 120 degrees
    var phase240 = 4 * Math.PI / 3; // 240 degrees

    var red = Math.cos(freq) * 127 + 128;
    var green = Math.cos(freq + phase120) * 127 + 128;
    var blue = Math.cos(freq + phase240) * 127 + 128;
    return 'rgb(' + Math.round(red) + ',' + Math.round(green) + ',' + Math.round(blue) + ')';
}


function createCylinder(n, len, rad, isCappedBottom, isCappedTop) {
    if (isCappedBottom === undefined) isCappedBottom = false;
    if (isCappedTop === undefined) isCappedTop = false;
    var len2 = len / 2;
    var geom = new THREE.Geometry();
    // push 2*n + 2 vertices
    var inc = 2 * Math.PI / n;

    for (var i = 0, a = 0; i <= n; i++ , a += inc) {
        var cos = Math.cos(a);
        var sin = Math.sin(a);
        bottomVertex = new THREE.Vector3(rad * cos, -len2, rad * sin);
        topVertex = new THREE.Vector3(rad * cos, len2, rad * sin);
        geom.vertices.push(bottomVertex, topVertex);
    }

    // push 2*n side faces (each of the n rectangular side faces
    // is constructed from 2 triangles)
    for (var i = 2; i < 2*n; i += 2) {
        geom.faces.push(new THREE.Face3(i-2, i-1, i)); // 0, 1, 2
        geom.faces.push(new THREE.Face3(i-1, i+1, i)); // 1, 3, 2
    }

    // close cylinder
    geom.faces.push(new THREE.Face3(0, 1, i-2)); // 0, 1, 0
    geom.faces.push(new THREE.Face3(1, i-2, i-1)); // 1, 0, 1

    if (isCappedTop)
        for (i = 0; i < n-2; i++)
            geom.faces.push(new THREE.Face3(0, 2*i+2, 2*i+4));
    if (isCappedBottom)
        for (i = 0; i < n-2; i++)
            geom.faces.push(new THREE.Face3(2*i+5, 2*i+3, 1));

    geom.computeFaceNormals();

    return geom;
}

function createSegmentedCylinder(n, i, segmentLen, rad, isCappedBottom, isCappedTop) {

    var mat = new THREE.MeshLambertMaterial({ color: divColor(i, nbrSegments), side: THREE.DoubleSide, overdraw: true });
    var geom = createCylinder(n, segmentLen, rad, (i == nbrSegments) ? isCappedBottom : true, (i == 1) ? isCappedTop : true);
    var parentmesh = new THREE.Mesh(geom, mat);
    if (i > 1) {
        var mesh = createSegmentedCylinder(n, i - 1, segmentLen, rad, isCappedBottom, isCappedTop);
        mesh.position.y = segmentLen; // shift whole stack of children 1 segment up
        parentmesh.add(mesh);
    }
    return parentmesh;

}

function createScene() {

    nbrSegments = 15;
    var n = 12;

    scene.add(createSegmentedCylinder(n, nbrSegments, 0.5, 2, true, true));

    // lights
    var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
    light.position.set(0, 0, 10);
    var light2 = new THREE.PointLight(0xFFFFFF, 1, 1000);
    light2.position.set(0, -10, -10);
    var ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(light);
    scene.add(light2);
    scene.add(ambientLight);
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

    camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 1000);
    camera.position.set(0, 20, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
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
createScene();
showGrids();
addToDOM();
render();
animate();

