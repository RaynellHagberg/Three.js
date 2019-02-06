/***********
 * regularPolygon.js
 * An n-sided regular polygon
 * Raynell Hagberg
 * January 2019
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

    function regularPolygonGeometry(n, innerColor, outerColor) {
        var geom = new THREE.CircleGeometry(2, n);
        for (var i = 0; i < geom.faces.length; i++) {
            geom.faces[i].vertexColors.push(outerColor);
            geom.faces[i].vertexColors.push(outerColor);
            geom.faces[i].vertexColors.push(innerColor);
        }
        return geom;
        
    }
 function createScene() {       
    // polygon geometry
    var red = new THREE.Color(0xFF0000);
    var blue = new THREE.Color(0x0000FF);
    var geom = regularPolygonGeometry(8, red, blue);
       
    // material
    var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors, side: THREE.DoubleSide });
  
    //  mesh
    var mesh = new THREE.Mesh(geom, material);
     
    // light
    //   args: color, intensity, range (0 if limitless)
    var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
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


