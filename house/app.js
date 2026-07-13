import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const card = document.querySelector('.house-visual-card');
const canvas = document.querySelector('#house-canvas');
const status = document.querySelector('#three-status');
const roomButtons = document.querySelectorAll('[data-room]');

if (!card || !canvas) throw new Error('House canvas target missing');

const roomMeta = {
  management: { color: 0xbb6545, position: [-3.4, 2.7, -1.8] },
  ux: { color: 0x235dca, position: [3.4, 2.7, -1.8] },
  brand: { color: 0xbb6545, position: [-3.4, .25, 2.05] },
  lab: { color: 0x235dca, position: [3.4, .25, 2.05] }
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2ecdf);

const camera = new THREE.PerspectiveCamera(31, 1.45, .1, 80);
camera.position.set(12, 9, 13);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = .065;
controls.target.set(0, 2.2, 0);
controls.enablePan = false;
controls.minDistance = 10;
controls.maxDistance = 22;
controls.maxPolarAngle = Math.PI / 2.12;

const root = new THREE.Group();
root.rotation.y = -.28;
root.userData.sculptRuntime = {
  nodes: {},
  meshes: {},
  sockets: {},
  colliders: {},
  destructionGroups: {
    management: ['management-room', 'workflow-wall', 'desk-cluster'],
    ux: ['ux-room', 'wireframe-wall', 'phone-prototype'],
    brand: ['brand-room', 'gallery-wall', 'palette-island'],
    lab: ['lab-room', 'code-wall', 'library-system']
  }
};
scene.add(root);

const mats = {
  plaster: material(0xe8dfd0, .86),
  plasterSide: material(0xc7bba9, .88),
  charcoal: material(0x181815, .58, .12),
  wood: material(0xc6a277, .78),
  woodDark: material(0x8a6144, .82),
  orange: material(0xbb6545, .58),
  blue: material(0x235dca, .46, .06),
  paper: material(0xf0eadf, .94),
  glass: new THREE.MeshPhysicalMaterial({ color: 0xc7d1cd, roughness: .18, transparent: true, opacity: .45, transmission: .25 })
};

buildLights();
buildHouse();
bindRooms();
resize();
window.addEventListener('resize', resize);
card.classList.add('three-ready');
status.textContent = 'Mode Three.js procédural';
status.classList.add('ready');
animate();

function material(color, roughness = .7, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function box(id, size, mat, position, rotation = [0, 0, 0], parent = root) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.componentId = id;
  parent.add(mesh);
  root.userData.sculptRuntime.meshes[id] = mesh;
  return mesh;
}

function cyl(id, radiusTop, radiusBottom, height, mat, position, rotation = [0, 0, 0], parent = root, segments = 32) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), mat);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.componentId = id;
  parent.add(mesh);
  root.userData.sculptRuntime.meshes[id] = mesh;
  return mesh;
}

function makeNode(id, position, parent = root) {
  const group = new THREE.Group();
  group.name = id;
  group.position.set(...position);
  group.userData.baseY = position[1];
  parent.add(group);
  root.userData.sculptRuntime.nodes[id] = group;
  return group;
}

function socket(id, position, parent) {
  const s = new THREE.Object3D();
  s.name = id;
  s.position.set(...position);
  parent.add(s);
  root.userData.sculptRuntime.sockets[id] = s;
}

function buildLights() {
  scene.add(new THREE.HemisphereLight(0xfff4e7, 0x514b45, 2.2));
  const key = new THREE.DirectionalLight(0xffdfaf, 4.3);
  key.position.set(-9, 12, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(1536, 1536);
  key.shadow.camera.left = -14;
  key.shadow.camera.right = 14;
  key.shadow.camera.top = 14;
  key.shadow.camera.bottom = -14;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb8ceff, 1.5);
  rim.position.set(10, 8, -9);
  scene.add(rim);
}

function buildHouse() {
  box('charcoal-base', [13.8, .42, 9.8], mats.charcoal, [0, -.25, 0]);
  box('warm-foundation', [13.2, .22, 9.2], mats.plasterSide, [0, .05, 0]);
  box('rear-wall', [13.2, 5.2, .22], mats.plaster, [0, 2.7, -4.45]);
  box('left-wall', [.22, 5.2, 9], mats.plaster, [-6.55, 2.7, 0]);
  box('right-wall', [.22, 5.2, 9], mats.plaster, [6.55, 2.7, 0]);
  box('middle-floor-left', [6.25, .22, 4.1], mats.wood, [-3.35, 2.45, -1.8]);
  box('middle-floor-right', [6.25, .22, 4.1], mats.wood, [3.35, 2.45, -1.8]);
  box('ground-floor-left', [6.25, .22, 4.1], mats.wood, [-3.35, .05, 2.1]);
  box('ground-floor-right', [6.25, .22, 4.1], mats.wood, [3.35, .05, 2.1]);
  box('central-tower', [1.45, 3.8, 1.25], mats.charcoal, [.2, 3.55, -1.7]);
  box('central-stair-spine', [1.05, .22, 4.9], mats.plasterSide, [.15, 1.35, .3], [-.55, 0, 0]);

  buildRoom('management', buildManagement);
  buildRoom('ux', buildUx);
  buildRoom('brand', buildBrand);
  buildRoom('lab', buildLab);
  buildTerrace();
  buildPlants();

  const ground = cyl('round-ground', 8.8, 8.8, .08, material(0xded5c7, 1), [0, -.55, 0], [Math.PI / 2, 0, 0], scene, 96);
  ground.receiveShadow = true;
}

function buildRoom(id, builder) {
  const group = makeNode(`${id}-room`, roomMeta[id].position);
  group.userData.roomId = id;
  group.userData.accent = roomMeta[id].color;
  builder(group, id);
  root.userData.sculptRuntime.colliders[id] = { type: 'box', size: [6.2, 2.4, 4.1], node: `${id}-room` };
  socket(`${id}-info-socket`, [0, 1.45, 0], group);
}

function buildManagement(g) {
  box('management-desk', [4.1, .18, .85], mats.charcoal, [-.5, .55, .15], [0, 0, 0], g);
  box('workflow-wall', [4.4, 1.35, .08], mats.charcoal, [-.55, 1.55, -1.9], [0, 0, 0], g);
  for (let i = 0; i < 12; i++) box(`workflow-note-${i}`, [.28, .22, .04], i % 3 ? mats.paper : mats.orange, [-2 + (i % 6) * .58, 1.15 + Math.floor(i / 6) * .38, -1.97], [0, 0, (i % 2 ? .08 : -.05)], g);
  for (let i = 0; i < 4; i++) box(`management-monitor-${i}`, [.65, .08, .42], mats.blue, [-1.75 + i * .85, .88, .05], [-.55, 0, 0], g);
  box('pilotage-table', [1.35, .62, 1.05], mats.plasterSide, [1.7, .35, .2], [0, 0, 0], g);
}

function buildUx(g) {
  box('ux-wireframe-wall', [4.7, 1.5, .08], mats.plasterSide, [.1, 1.5, -1.9], [0, 0, 0], g);
  for (let i = 0; i < 8; i++) box(`wireframe-card-${i}`, [.72, .42, .04], mats.paper, [-1.75 + (i % 4) * .9, 1.12 + Math.floor(i / 4) * .55, -1.98], [0, 0, 0], g);
  box('phone-prototype-body', [.58, 1.12, .11], mats.charcoal, [1.72, 1.55, -2.02], [0, 0, 0], g);
  box('phone-prototype-screen', [.45, .9, .04], mats.blue, [1.72, 1.55, -1.94], [0, 0, 0], g);
  box('ux-desk', [3.2, .18, .82], mats.charcoal, [.5, .55, .2], [0, 0, 0], g);
}

function buildBrand(g) {
  box('gallery-counter', [4.5, .72, .75], mats.charcoal, [-.5, .35, -1.35], [0, 0, 0], g);
  for (let i = 0; i < 3; i++) {
    box(`brand-frame-${i}`, [.82, 1.08, .06], mats.paper, [-1.55 + i * 1.15, 1.12, -1.95], [0, 0, 0], g);
    box(`brand-symbol-${i}`, [.34, .34, .04], i === 1 ? mats.charcoal : mats.orange, [-1.55 + i * 1.15, 1.18, -1.89], [0, 0, i * .42], g);
  }
  box('palette-island', [2.45, .58, 1.12], mats.plasterSide, [.65, .32, .35], [0, 0, 0], g);
  for (let i = 0; i < 5; i++) box(`palette-chip-${i}`, [.33, .05, .26], [mats.orange, mats.blue, mats.charcoal, mats.paper, mats.wood][i], [-.25 + i * .38, .66, .34], [0, 0, 0], g);
}

function buildLab(g) {
  box('code-wall', [3.35, 1.25, .08], mats.charcoal, [-.55, 1.55, -1.95], [0, 0, 0], g);
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 6; col++) {
      box(`code-line-${row}-${col}`, [.16 + ((row + col) % 3) * .08, .03, .025], col % 3 ? mats.paper : mats.blue, [-1.65 + col * .44, 1.98 - row * .18, -1.9], [0, 0, 0], g);
    }
  }
  box('lab-desk', [3.1, .18, .82], mats.charcoal, [-.45, .55, .25], [0, 0, 0], g);
  for (let i = 0; i < 8; i++) box(`library-book-${i}`, [.16, .58, .42], i % 2 ? mats.woodDark : mats.paper, [1.85 + (i % 4) * .2, .58 + Math.floor(i / 4) * .55, 1.35], [0, 0, 0], g);
}

function buildTerrace() {
  box('roof-terrace', [4.8, .25, 3.3], mats.charcoal, [3.8, 5.05, -2.2]);
  box('roof-rail-back', [4.8, .08, .08], mats.charcoal, [3.8, 5.72, -3.85]);
  box('roof-rail-side', [.08, .08, 3.25], mats.charcoal, [6.2, 5.72, -2.25]);
  cyl('terrace-sculpture', .32, .36, .72, mats.orange, [3.9, 5.58, -2.2], [0, 0, 0], root, 32);
}

function buildPlants() {
  [[-5.4, .38, 3.4], [5.2, .38, 3.45], [5.55, 5.35, -2.8]].forEach(([x, y, z], index) => {
    const plant = makeNode(`plant-${index}`, [x, y, z]);
    cyl(`plant-pot-${index}`, .28, .36, .45, mats.charcoal, [0, .2, 0], [0, 0, 0], plant, 18);
    for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(.11, .7, 8), material(0x4f6045, .9));
      leaf.position.set(0, .7, 0);
      leaf.rotation.set(.45, i * .9, (i - 3) * .24);
      leaf.castShadow = true;
      plant.add(leaf);
    }
  });
}

function bindRooms() {
  roomButtons.forEach(button => {
    button.addEventListener('click', () => focusRoom(button.dataset.room));
  });
}

function focusRoom(id) {
  const node = root.userData.sculptRuntime.nodes[`${id}-room`];
  if (!node) return;
  Object.values(root.userData.sculptRuntime.nodes).forEach(item => {
    if (item.userData.roomId) item.userData.selected = item.userData.roomId === id;
  });
  const target = new THREE.Vector3().setFromMatrixPosition(node.matrixWorld);
  controls.target.lerp(target, .55);
}

function resize() {
  const rect = card.getBoundingClientRect();
  const width = Math.max(320, rect.width);
  const height = Math.max(240, rect.height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function animate(time = 0) {
  requestAnimationFrame(animate);
  const t = time * .001;
  root.rotation.y = -.28 + Math.sin(t * .25) * .025;
  Object.values(root.userData.sculptRuntime.nodes).forEach(node => {
    if (!node.userData.roomId) return;
    const lift = node.userData.selected ? .18 : 0;
    node.position.y += ((node.userData.baseY || 0) + lift - node.position.y) * .08;
    node.scale.setScalar(node.scale.x + ((node.userData.selected ? 1.035 : 1) - node.scale.x) * .08);
  });
  controls.update();
  renderer.render(scene, camera);
}
