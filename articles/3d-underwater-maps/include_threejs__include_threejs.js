const OPTS = {
    SHOULD_WIREFRAME_SATELLITE_MESH: true,
    DEFAULT_VIEW: "Wireframe",
    // DEFAULT_VIEW: "Satellite",
    ZOOM: 13,
    RADIUS: 5,
    DEFAULT_LOCATION_ORIGIN: [-42.8717, 147.3435],
    DEFAULT_LOCATION_TITLE: 'Hobart'
}

const canvas = document.getElementById("three-geo");
const camera = new THREE.PerspectiveCamera(
    50,
    canvas.width / canvas.height,
    0.01,
    1000
);
camera.up.set(0, 0, 1);
camera.position.x = 0.09724288111810958;
camera.position.y = -0.14891529975100573;
camera.position.z = 0.05779003918673957;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// https://stackoverflow.com/questions/29884485/threejs-canvas-size-based-on-container
const resizeCanvasToDisplaySize = (force=false) => {
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    // adjust displayBuffer size to match
    if (force || canvas.width != width || canvas.height != height) {
        // you must pass false here or three.js sadly fights the browser
        // console.log "resizing: #{canvas.width} #{canvas.height} -> #{width} #{height}"
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
};
resizeCanvasToDisplaySize(true); // first time

// scene
const scene = new THREE.Scene();
const walls = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxBufferGeometry(1, 1, 1)),
    new THREE.LineBasicMaterial({ color: 0xcccccc })
);
walls.position.set(0, 0, 0);
scene.add(walls);
scene.add(new THREE.AxesHelper(1));

const render = () => {
    resizeCanvasToDisplaySize();
    renderer.render(scene, camera);
};

render();
controls.addEventListener('change', render);
// https://stackoverflow.com/questions/20112043/orbitcontrols-auto-rotate-stop-when-interactive
// controls.autoRotate = true;

const tgeo = new ThreeGeo({
    tokenMapbox: 'pk.eyJ1IjoidnVsa2QiLCJhIjoiY2l2MjJ0bjY4MDE4ZjJ0cW9najE0MW0wayJ9.IOY253HZ-zQBvu-F14Jp-g'
});

tgeo.getTerrain(OPTS.DEFAULT_LOCATION_ORIGIN, OPTS.RADIUS, OPTS.ZOOM, {
    onRgbDem: meshes => {
        meshes.forEach(mesh => scene.add(mesh));
        render();
    },
    // onSatelliteMat: mesh => {
    //     render();
    // }
});

