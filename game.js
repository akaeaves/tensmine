// game.js

let scene, camera, renderer;
let player, enemy;
let playerVelocity = 0;
let enemyVelocity = 0;
let punchCooldown = 0;
let kickCooldown = 0;

init();
animate();

function init() {
  // Scene & Camera
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Player
  const playerGeo = new THREE.BoxGeometry(1, 2, 1);
  const playerMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  player = new THREE.Mesh(playerGeo, playerMat);
  player.position.set(-3, 1, 0);
  scene.add(player);

  // Enemy
  const enemyGeo = new THREE.BoxGeometry(1, 2, 1);
  const enemyMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  enemy = new THREE.Mesh(enemyGeo, enemyMat);
  enemy.position.set(3, 1, 0);
  scene.add(enemy);

  // Resize listener
  window.addEventListener("resize", onWindowResize);

  // Controls
  setupControls();
}

function setupControls() {
  document.getElementById("left").addEventListener("touchstart", () => playerVelocity = -0.1);
  document.getElementById("right").addEventListener("touchstart", () => playerVelocity = 0.1);
  document.getElementById("left").addEventListener("touchend", () => playerVelocity = 0);
  document.getElementById("right").addEventListener("touchend", () => playerVelocity = 0);

  document.getElementById("punch").addEventListener("touchstart", punch);
  document.getElementById("kick").addEventListener("touchstart", kick);
}

function punch() {
  if (punchCooldown > 0) return;
  punchCooldown = 30;
  if (Math.abs(player.position.x - enemy.position.x) < 1.5) {
    enemy.material.color.set(0xffff00); // hit color
    setTimeout(() => enemy.material.color.set(0xff0000), 200);
  }
}

function kick() {
  if (kickCooldown > 0) return;
  kickCooldown = 60;
  if (Math.abs(player.position.x - enemy.position.x) < 2) {
    enemy.material.color.set(0x00ffff); // hit color
    setTimeout(() => enemy.material.color.set(0xff0000), 200);
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Movement
  player.position.x += playerVelocity;

  // Cooldowns
  if (punchCooldown > 0) punchCooldown--;
  if (kickCooldown > 0) kickCooldown--;

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
