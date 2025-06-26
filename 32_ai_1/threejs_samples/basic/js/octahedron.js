import * as THREE from 'three';
import { Light } from './Light.js';

// DOM要素取得
const canvasContainer = document.getElementById('canvas-container');
const wireframeToggle = document.getElementById('wireframeToggle');
const radiusSlider = document.getElementById('radiusSlider');
const detailSlider = document.getElementById('detailSlider');

const radiusValue = document.getElementById('radiusValue');
const detailValue = document.getElementById('detailValue');

// 初期パラメータ
let octahedron;
let radius = parseFloat(radiusSlider.value);
let detail = parseInt(detailSlider.value);

// キャンバスサイズ
const canvasWidth = canvasContainer.clientWidth;
const canvasHeight = canvasContainer.clientHeight;
const speed = 0.01;
const geometryColor = 0xff0000;
const wireColor = 0xff0000;
const backgroundColor = 0xffffff;

// シーン作成
const scene = new THREE.Scene();

// ライト追加 (Light.js 内のクラスを利用)
const light = new Light();
light.add(scene);

// カメラ作成 (視野角75°、キャンバスサイズに合わせたアスペクト比)
const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
camera.position.z = 5;

// レンダラー作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(canvasWidth, canvasHeight);
renderer.setClearColor(backgroundColor, 1);
canvasContainer.appendChild(renderer.domElement);

/**
 * OctahedronGeometry を生成してシーンに追加する関数
 * @param {object} params { color, position }
 */
function addOctahedron(params = {}) {
    const color = params.color || geometryColor;
    const position = params.position || { x: 0, y: 0, z: 0 };

    // OctahedronGeometry( radius, detail )
    const geometry = new THREE.OctahedronGeometry(radius, detail);
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    octahedron = new THREE.Mesh(geometry, material);
    octahedron.position.set(position.x, position.y, position.z);
    scene.add(octahedron);

    // ワイヤーフレーム追加
    updateWireframe(octahedron, geometry);
    updateGeometry();
}

/**
 * スライダーの値に応じて OctahedronGeometry を更新する関数
 */
function updateGeometry() {
    // 値の更新と表示
    radius = parseFloat(radiusSlider.value);
    detail = parseInt(detailSlider.value);
    radiusValue.innerText = radius;
    detailValue.innerText = detail;

    // 古いジオメトリを破棄し、新規に作成
    octahedron.geometry.dispose();
    const newGeometry = new THREE.OctahedronGeometry(radius, detail);
    octahedron.geometry = newGeometry;

    // ワイヤーフレーム再作成
    updateWireframe(octahedron, newGeometry);
}

/**
 * メッシュにワイヤーフレームを追加／更新する関数
 * @param {THREE.Mesh} mesh - 対象メッシュ
 * @param {THREE.Geometry} geometry - ワイヤーフレーム用ジオメトリ
 */
function updateWireframe(mesh, geometry) {
    // 既存のワイヤーフレームを削除
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

// スライダーイベントの追加
radiusSlider.addEventListener('input', updateGeometry);
detailSlider.addEventListener('input', updateGeometry);

// ワイヤーフレーム切替ボタン
wireframeToggle.addEventListener('click', () => {
    const enabled = octahedron.material.wireframe;
    octahedron.material.wireframe = !enabled;
    // 追加したワイヤーフレームメッシュの表示切替
    octahedron.children.forEach(child => {
        child.visible = !enabled;
    });
    wireframeToggle.innerText = !enabled ? 'ON' : 'OFF';
});

// Octahedron生成
addOctahedron();
// アニメーション開始
animate(octahedron);
