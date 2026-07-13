import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.querySelector('#house-canvas');
const loading = document.querySelector('#loading');
const fallback = document.querySelector('#fallback');
const label = document.querySelector('#room-label');
const panel = document.querySelector('#house-info');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const ROOM_DATA = {
  overview: {
    index: 'Vue générale', title: 'La maison des systèmes clairs',
    copy: 'Une lecture spatiale de mon travail : structurer, concevoir, donner une identité et livrer des expériences numériques cohérentes.',
    projects: [['01', '15+ projets livrés', 'Abidjan × Cotonou'], ['02', 'Trois expertises reliées', 'Stratégie · Produit · Design']]
  },
  management: {
    index: '01 / Bureau de pilotage', title: 'Gestion & transformation digitale',
    copy: 'Je transforme des objectifs complexes en responsabilités lisibles, workflows pilotables et livraisons concrètes.',
    projects: [['01', 'JDIS — Digital System', 'Produit & logistique'], ['02', 'Workflows opérationnels', 'Gouvernance · Coordination']]
  },
  ux: {
    index: '02 / Studio UX', title: 'Stratégie & product design',
    copy: 'Recherche, architecture de l’information et interfaces : chaque décision part des usages et réduit la friction.',
    projects: [['01', 'Le Petit Nokoué', 'Audit UX · Design system'], ['02', 'JDIS', 'UX/UI · Expérience logistique']]
  },
  brand: {
    index: '03 / Galerie créative', title: 'Branding & direction créative',
    copy: 'Des identités reconnaissables, cohérentes et capables de garder leur force sur chaque point de contact.',
    projects: [['01', 'CDCRB — Patrimoine', 'Culture & identité'], ['02', 'Africaine Vie', 'Assurance & marque'], ['03', 'The Busy Bee School', 'Brand design']]
  },
  lab: {
    index: '04 / Laboratoire digital', title: 'Interfaces & prototypage',
    copy: 'Je rapproche design et exécution pour produire des interfaces précises, testables et techniquement réalistes.',
    projects: [['01', 'Lyz Digital', 'Frontend'], ['02', 'Prototypes interactifs', 'Figma · GitHub · IA']]
  }
};

const CAMERA_TARGETS = {
  overview: { pos: [14, 11, 16], target: [0, 2.2, 0] },
  management: { pos: [-10, 7, 11], target: [-3.7, 3.8, -1.6] },
  ux: { pos: [11, 7, 10], target: [3.7, 3.8, -1.4] },
  brand: { pos: [-10, 5, 10], target: [-3.8, 1.4, 2.2] },
  lab: { pos: [11, 5, 10], target: [3.8, 1.4, 2.2] }
};

let scene, camera, renderer, controls, house, raycaster, pointer;
let activeRoom = 'overview';
let hoveredRoom = null;
let cameraGoal = null;
let targetGoal = null;
let raf = 0;
const roomGroups = new Map();
const interactiveMeshes = [];

try {
  init();
  buildHouse();
  bindUI();
  resize();
  loading.classList.add('done');
  animate();
} catch (error) {
  console.error(error);
  loading.classList.add('done');
  fallback.hidden = false;
  canvas.hidden = true;
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1efe8);
  scene.fog = new THREE.Fog(0xf1efe8, 22, 42);

  camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, .1, 100);
  camera.position.set(...CAMERA_TARGETS.overview.pos);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  controls = new OrbitControls(camera, canvas);
  controls.target.set(...CAMERA_TARGETS.overview.target);
  controls.enableDamping = true;
  controls.dampingFactor = .055;
  controls.minDistance = 10;
  controls.maxDistance = 27;
  controls.minPolarAngle = .45;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.enablePan = false;

  scene.add(new THREE.HemisphereLight(0xfff7e9, 0x56514a, 2.1));
  const key = new THREE.DirectionalLight(0xffe4bd, 4.1);
  key.position.set(-8, 13, 10);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -14; key.shadow.camera.right = 14;
  key.shadow.camera.top = 14; key.shadow.camera.bottom = -14;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xbfd4ff, 1.7);
  rim.position.set(10, 8, -8);
  scene.add(rim);

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
}

function mat(color, roughness = .72, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}
const M = {
  plaster: mat(0xe7dfd1, .86), plasterDark: mat(0xc5bcae, .9),
  charcoal: mat(0x242320, .55, .1), black: mat(0x11110f, .42, .22),
  wood: mat(0xa97e59, .76), paleWood: mat(0xc7a57d, .78),
  terra: mat(0xbb6545, .58), blue: mat(0x235dca, .44, .08),
  paper: mat(0xeee7d9, .94), green: mat(0x4f6045, .9),
  glass: new THREE.MeshPhysicalMaterial({ color: 0xbfc9c5, roughness: .15, transmission: .3, transparent: true, opacity: .55 })
};

function mesh(geometry, material, position, rotation = [0, 0, 0], shadows = true) {
  const m = new THREE.Mesh(geometry, material);
  m.position.set(...position);
  m.rotation.set(...rotation);
  m.castShadow = shadows;
  m.receiveShadow = shadows;
  return m;
}

function box(size, material, position, rotation) {
  return mesh(new THREE.BoxGeometry(...size), material, position, rotation);
}

function addRoom(id, origin, accent) {
  const group = new THREE.Group();
  group.name = id;
  group.position.set(...origin);
  group.userData = { roomId: id, baseY: origin[1], accent };
  house.add(group);
  roomGroups.set(id, group);
  return group;
}

function tagInteractive(object, roomId) {
  object.traverse(child => {
    if (!child.isMesh) return;
    child.userData.roomId = roomId;
    interactiveMeshes.push(child);
  });
}

function buildHouse() {
  house = new THREE.Group();
  house.rotation.y = -.08;
  house.userData.sculptRuntime = { nodes: {}, meshes: {}, sockets: {}, colliders: {}, destructionGroups: {} };
  scene.add(house);

  const base = box([13.6, .45, 9.8], M.charcoal, [0, -.15, 0]);
  house.add(base);
  house.add(box([12.9, .22, 9.1], M.plasterDark, [0, .19, 0]));

  const floorPositions = [[-3.45, .35, 2.15], [3.45, .35, 2.15], [-3.45, 3.0, -1.8], [3.45, 3.0, -1.8]];
  floorPositions.forEach((p, i) => house.add(box([6.4, .24, 4.2], i % 2 ? M.paleWood : M.wood, p)));

  const wallSpecs = [
    [[.22, 5.8, 9], M.plaster, [-6.55, 2.9, 0]],
    [[.22, 5.8, 9], M.plaster, [6.55, 2.9, 0]],
    [[13.3, 5.8, .22], M.plaster, [0, 2.9, -4.45]],
    [[.18, 2.55, 4.15], M.plaster, [0, 1.55, 2.15]],
    [[.18, 2.55, 4.15], M.plaster, [0, 4.18, -1.8]],
    [[13.1, .25, .3], M.plaster, [0, 5.85, -4.22]]
  ];
  wallSpecs.forEach(([s, material, p]) => house.add(box(s, material, p)));

  const management = addRoom('management', [-3.45, 3.25, -1.75], 0xbb6545);
  buildManagement(management);
  const ux = addRoom('ux', [3.45, 3.25, -1.75], 0x235dca);
  buildUx(ux);
  const brand = addRoom('brand', [-3.45, .58, 2.15], 0xbb6545);
  buildBrand(brand);
  const lab = addRoom('lab', [3.45, .58, 2.15], 0x235dca);
  buildLab(lab);

  buildStairs();
  buildTerrace();
  buildPlants();
  buildGround();
  roomGroups.forEach((group, id) => tagInteractive(group, id));
}

function buildDesk(group, x, z, width = 3) {
  group.add(box([width, .15, .9], M.charcoal, [x, .72, z]));
  group.add(box([.14, .7, .75], M.black, [x - width / 2 + .16, .35, z]));
  group.add(box([.14, .7, .75], M.black, [x + width / 2 - .16, .35, z]));
}

function buildManagement(g) {
  buildDesk(g, -.5, .2, 4.2);
  for (let i = 0; i < 4; i++) {
    g.add(box([.72, .08, .45], M.black, [-1.75 + i * .84, 1.04, .18], [-.55, 0, 0]));
  }
  const board = box([4.6, 1.65, .12], M.charcoal, [-.6, 1.7, -1.98]);
  g.add(board);
  const nodes = [[-1.9,1.85],[-1.1,2.1],[-.25,1.55],[.55,2.2],[1.25,1.7]];
  nodes.forEach((p, i) => g.add(box([.28, .28, .08], i === 3 ? M.blue : M.terra, [p[0], p[1], -2.08])));
  for (let i = 0; i < 7; i++) g.add(box([.42, .3, .08], i % 3 === 0 ? M.terra : M.paper, [-2.1 + (i % 4) * .62, 1.15 + Math.floor(i / 4) * .42, -2.09]));
  const table = box([1.6, .8, 1.15], M.plasterDark, [1.7, .42, .15]);
  g.add(table);
  g.add(box([1.12, .06, .74], M.blue, [1.7, .85, .15]));
}

function buildUx(g) {
  buildDesk(g, .5, .25, 3.6);
  const wall = box([4.75, 1.75, .12], M.plasterDark, [.2, 1.7, -1.98]);
  g.add(wall);
  for (let i = 0; i < 6; i++) {
    const x = -1.55 + (i % 3) * 1.15;
    const y = 1.32 + Math.floor(i / 3) * .7;
    g.add(box([.82, .5, .06], M.paper, [x, y, -2.07]));
  }
  const phone = new THREE.Group();
  phone.add(box([.62, 1.25, .12], M.black, [0, 0, 0]));
  phone.add(box([.5, 1.02, .03], M.blue, [0, 0, .08]));
  phone.position.set(1.65, 1.78, -2.13);
  g.add(phone);
  g.add(box([.75, .06, .5], M.blue, [.35, 1.02, .2], [-.12, 0, 0]));
  g.add(box([.55, .06, .4], M.paper, [1.25, 1.02, .1], [-.08, 0, 0]));
}

function buildBrand(g) {
  const counter = box([4.7, .75, .72], M.charcoal, [-.5, .38, -1.38]);
  g.add(counter);
  const frames = [[-1.65,.62,1.15],[-.55,.72,1.35],[.65,.68,1.22]];
  frames.forEach((p, i) => {
    g.add(box([.92, 1.3, .08], M.paper, [p[0], p[1] + .95, -1.95]));
    if (i === 0) g.add(mesh(new THREE.CylinderGeometry(.25,.25,.05,32), M.terra, [p[0], p[1]+1.05,-2.02], [Math.PI/2,0,0]));
    if (i === 1) g.add(box([.42,.42,.04], M.black, [p[0],p[1]+1.06,-2.02], [0,0,.75]));
    if (i === 2) g.add(box([.5,.22,.04], M.terra, [p[0],p[1]+1.06,-2.02]));
  });
  const island = box([2.5, .7, 1.25], M.plasterDark, [.6, .38, .45]);
  g.add(island);
  [M.terra, M.blue, M.black, M.paper].forEach((material, i) => g.add(box([.42,.05,.34], material, [-.12 + i*.48, .76, .35])));
  g.add(mesh(new THREE.SphereGeometry(.34,24,16), M.terra, [-1.2, 1.05, .45]));
  g.add(box([.12,.62,.12], M.black, [-1.2,.65,.45]));
}

function buildLab(g) {
  buildDesk(g, -.45, .3, 3.2);
  const screen = box([3.35, 1.45, .14], M.black, [-.45, 1.72, -1.95]);
  g.add(screen);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const width = .18 + ((row * 7 + col * 3) % 4) * .07;
      g.add(box([width, .035, .02], col % 3 === 0 ? M.blue : M.paper, [-1.65 + col*.45, 2.12-row*.25, -2.04]));
    }
  }
  g.add(box([.82,.06,.55], M.blue, [-.45,1.03,.28], [-.12,0,0]));
  const shelf = box([1.25, 2.35, .42], M.charcoal, [2.15, 1.18, -1.72]);
  g.add(shelf);
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
    g.add(box([.18 + (x%2)*.08, .36, .2], (x+y)%4===0?M.terra:M.paper, [1.78+x*.25, .32+y*.52, -1.45]));
  }
}

function buildStairs() {
  const stair = new THREE.Group();
  for (let i = 0; i < 8; i++) stair.add(box([1.2, .18, .55], M.paleWood, [.25, .18 + i*.26, 2.8 - i*.42]));
  stair.position.set(0, .18, -.15);
  house.add(stair);
}

function buildTerrace() {
  const terrace = new THREE.Group();
  terrace.position.set(3.2, 5.95, -1.6);
  terrace.add(box([5.6,.18,4.5], M.charcoal, [0,0,0]));
  terrace.add(mesh(new THREE.CylinderGeometry(.72,.82,.52,32), M.plaster, [.5,.34,.1]));
  terrace.add(mesh(new THREE.SphereGeometry(.42,24,18), M.terra, [.5,1.12,.1]));
  terrace.add(box([.1,.65,.1], M.black, [.5,.68,.1]));
  for (let i=0;i<3;i++) terrace.add(mesh(new THREE.CylinderGeometry(.25,.3,.4,24), i===1?M.terra:M.paleWood, [-.9+i*.75,.3,.85]));
  house.add(terrace);
}

function buildPlants() {
  [[-5.45,.25,3.45],[5.35,.25,3.5],[5.2,6.15,-2.6]].forEach(([x,y,z], index) => {
    const plant = new THREE.Group();
    plant.add(mesh(new THREE.CylinderGeometry(.28,.38,.6,16), M.charcoal, [0,.3,0]));
    for(let i=0;i<7;i++) {
      const leaf = mesh(new THREE.ConeGeometry(.12,.85,8), M.green, [0,.9,0], [0,0,(i-3)*.23]);
      leaf.rotation.y = i * .9;
      plant.add(leaf);
    }
    plant.position.set(x,y,z);
    plant.scale.setScalar(index===2?.75:1);
    house.add(plant);
  });
}

function buildGround() {
  const ground = mesh(new THREE.CircleGeometry(18, 64), mat(0xd9d0c0, 1), [0,-.41,0], [-Math.PI/2,0,0]);
  ground.receiveShadow = true;
  scene.add(ground);
  const ring = mesh(new THREE.RingGeometry(8.8, 9, 64), mat(0xbb6545,.8), [0,-.39,0], [-Math.PI/2,0,0]);
  scene.add(ring);
}

function bindUI() {
  addEventListener('resize', resize);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerleave', () => setHover(null));
  canvas.addEventListener('click', () => { if (hoveredRoom) focusRoom(hoveredRoom); });
  document.querySelectorAll('[data-room]').forEach(button => button.addEventListener('click', () => focusRoom(button.dataset.room)));
  document.querySelector('.panel-close').addEventListener('click', () => panel.classList.remove('open'));
  addEventListener('keydown', event => { if (event.key === 'Escape') { focusRoom('overview'); panel.classList.remove('open'); } });
}

function onPointerMove(event) {
  pointer.x = (event.clientX / innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / innerHeight) * 2 + 1;
  label.style.left = `${event.clientX}px`;
  label.style.top = `${event.clientY}px`;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(interactiveMeshes, false)[0];
  setHover(hit?.object.userData.roomId || null);
}

function setHover(id) {
  if (id === hoveredRoom) return;
  hoveredRoom = id;
  label.classList.toggle('visible', Boolean(id));
  if (id) label.textContent = ROOM_DATA[id].index;
  roomGroups.forEach((group, roomId) => { group.userData.hovered = roomId === id; });
}

function focusRoom(id) {
  activeRoom = id;
  const destination = CAMERA_TARGETS[id];
  cameraGoal = new THREE.Vector3(...destination.pos);
  targetGoal = new THREE.Vector3(...destination.target);
  document.querySelectorAll('[data-room]').forEach(button => button.classList.toggle('active', button.dataset.room === id));
  roomGroups.forEach((group, roomId) => { group.userData.active = id === 'overview' || roomId === id; });
  updatePanel(id);
  if (id === 'overview') panel.classList.remove('open'); else panel.classList.add('open');
}

function updatePanel(id) {
  const data = ROOM_DATA[id];
  panel.querySelector('.panel-index').textContent = data.index;
  panel.querySelector('h2').textContent = data.title;
  panel.querySelector('.panel-copy').textContent = data.copy;
  panel.querySelector('.panel-projects').innerHTML = data.projects.map(([n, title, meta]) => `<div class="project-item"><span>${n}</span><div><strong>${title}</strong><small>${meta}</small></div></div>`).join('');
}

function resize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.3 : 1.8));
}

function animate(time = 0) {
  raf = requestAnimationFrame(animate);
  const t = time * .001;
  if (cameraGoal) {
    camera.position.lerp(cameraGoal, reducedMotion ? 1 : .045);
    controls.target.lerp(targetGoal, reducedMotion ? 1 : .055);
    if (camera.position.distanceTo(cameraGoal) < .03) { cameraGoal = null; targetGoal = null; }
  }
  roomGroups.forEach(group => {
    const selected = activeRoom !== 'overview' && group.name === activeRoom;
    const lift = group.userData.hovered ? .14 : selected ? .07 : 0;
    const scale = group.userData.hovered ? 1.018 : selected ? 1.01 : 1;
    group.position.y += (group.userData.baseY + lift - group.position.y) * .1;
    group.scale.setScalar(group.scale.x + (scale - group.scale.x) * .1);
  });
  if (!reducedMotion && activeRoom === 'overview') house.rotation.y = -.08 + Math.sin(t * .28) * .025;
  controls.update();
  renderer.render(scene, camera);
}

addEventListener('beforeunload', () => cancelAnimationFrame(raf));
