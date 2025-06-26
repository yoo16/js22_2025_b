import * as THREE from 'three';
import { Light } from './Light.js';

// DOM 要素の取得
const canvasContainer = document.getElementById('canvas-container');
const wireframeToggle = document.getElementById('wireframeToggle');

const innerRadiusSlider = document.getElementById('innerRadiusSlider');
const outerRadiusSlider = document.getElementById('outerRadiusSlider');
const thetaSegSlider = document.getElementById('thetaSegSlider');
const phiSegSlider = document.getElementById('phiSegSlider');

const innerRadiusValue = document.getElementById('innerRadiusValue');
const outerRadiusValue = document.getElementById('outerRadiusValue');
const thetaSegValue = document.getElementById('thetaSegValue');
const phiSegValue = document.getElementById('phiSegValue');

// 変数＆初期値
let ring;
let innerRadius = parseFloat(innerRadiusSlider.value);
let outerRadius = parseFloat(outerRadiusSlider.value);
let thetaSegments = parseInt(thetaSegSlider.value);
let phiSegments = parseInt(phiSegSlider.value);

// 定数
const canvasWidth = canvasContainer.clientWidth;
const canvasHeight = canvasContainer.clientHeight;
const speed = 0.01;
const geometryColor = 0xff0000;
const wireColor = 0xff0000;
const backgroundColor = 0xffffff;

// シーン作成
const scene = new THREE.Scene();
// ライトの追加 (Light.js 内のクラスを利用)
const light = new Light();
light.add(scene);

// カメラ作成 (視野角75°、コンテナサイズに合わせたアスペクト比)
const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
camera.position.z = 5;

// レンダラー作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(canvasWidth, canvasHeight);
renderer.setClearColor(backgroundColor, 1);
canvasContainer.appendChild(renderer.domElement);

/**
 * RingGeometry を生成してシーンに追加する関数
 * @param {object} params { color, position }
 */
function addRing(params = {}) {
    const color = params.color || geometryColor;
    const position = params.position || { x: 0, y: 0, z: 0 };

    // thetaStart = 0, thetaLength = 2π としてリング全体を作成
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, 0, Math.PI * 2);
    const material = new THREE.MeshStandardMaterial({
        color: color,
        side: THREE.DoubleSide, // リングは両面表示
        wireframe: false
    });
    ring = new THREE.Mesh(geometry, material);
    ring.position.set(position.x, position.y, position.z);
    scene.add(ring);

    // ワイヤーフレーム追加
    updateWireframe(ring, geometry);
    updateGeometry();
}

/**
 * スライダーの値に応じて RingGeometry を更新する関数
 */
function updateGeometry() {
    innerRadius = parseFloat(innerRadiusSlider.value);
    outerRadius = parseFloat(outerRadiusSlider.value);
    thetaSegments = parseInt(thetaSegSlider.value);
    phiSegments = parseInt(phiSegSlider.value);

    // 表示更新
    innerRadiusValue.innerText = innerRadius;
    outerRadiusValue.innerText = outerRadius;
    thetaSegValue.innerText = thetaSegments;
    phiSegValue.innerText = phiSegments;

    // 古いジオメトリの破棄と新しいジオメトリの作成
    ring.geometry.dispose();
    const newGeometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, 0, Math.PI * 2);
    ring.geometry = newGeometry;

    // ワイヤーフレームの再作成
    updateWireframe(ring, newGeometry);
}

/**
 * メッシュのワイヤーフレームを更新する関数
 * @param {THREE.Mesh} mesh - 対象メッシュ
 * @param {THREE.Geometry} geometry - ワイヤーフレーム用ジオメトリ
 */
function updateWireframe(mesh, geometry) {
    while (mesh.children.length > 0) {
        mesh.remove(mesh.children[0]);
    }
    const wireframe = new THREE.WireframeGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: wireColor });
    const wireframeMesh = new THREE.LineSegments(wireframe, lineMaterial);
    mesh.add(wireframeMesh);
}

/**
 * アニメーションループ
 * @param {THREE.Mesh} mesh - 対象メッシュ
 */
function animate(mesh) {
    requestAnimationFrame(animate.bind(null, mesh));
    mesh.rotation.x += speed;
    mesh.rotation.y += speed;
    renderer.render(scene, camera);
}

// スライダーのイベントリスナー
innerRadiusSlider.addEventListener('input', updateGeometry);
outerRadiusSlider.addEventListener('input', updateGeometry);
thetaSegSlider.addEventListener('input', updateGeometry);
phiSegSlider.addEventListener('input', updateGeometry);

// ワイヤーフレーム切替
wireframeToggle.addEventListener('click', () => {
    const enabled = ring.material.wireframe;
    ring.material.wireframe = !enabled;
    // 追加したワイヤーフレームメッシュの表示も切替
    ring.children.forEach(child => {
        child.visible = !enabled;
    });
    wireframeToggle.innerText = !enabled ? 'ON' : 'OFF';
});

// Ring 生成
addRing();
// アニメーション開始
animate(ring);