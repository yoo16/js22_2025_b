import * as THREE from 'three';
import { Light } from './Light.js';

// DOM 要素取得
const canvasContainer = document.getElementById('canvas-container');
const wireframeToggle = document.getElementById('wireframeToggle');
const radiusSlider = document.getElementById('radiusSlider');
const detailSlider = document.getElementById('detailSlider');
const radiusValue = document.getElementById('radiusValue');
const detailValue = document.getElementById('detailValue');

// 変数＆定数
let dodecahedron;
let radius = parseFloat(radiusSlider.value);
let detail = parseInt(detailSlider.value);

const canvasWidth = canvasContainer.clientWidth;
const canvasHeight = canvasContainer.clientHeight;
const speed = 0.01;
const geometryColor = 0xff0000;
const wireColor = 0xff0000;
const backgroundColor = 0xffffff;

// シーン作成
const scene = new THREE.Scene();

// ライトの追加 (Light.js 内のクラスを使用)
const light = new Light();
light.add(scene);

// カメラ作成 (視野角75°、アスペクト比はコンテナサイズ、近接面0.1～遠方面1000)
const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
camera.position.z = 5;

// レンダラー作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(canvasWidth, canvasHeight);
renderer.setClearColor(backgroundColor, 1);
canvasContainer.appendChild(renderer.domElement);

/**
 * Dodecahedron を生成してシーンに追加する関数
 * @param {object} params { color, position }
 */
function addDodecahedron(params = {}) {
    const color = params.color || geometryColor;
    const position = params.position || { x: 0, y: 0, z: 0 };

    // DodecahedronGeometry(radius, detail)
    const geometry = new THREE.DodecahedronGeometry(radius, detail);
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    dodecahedron = new THREE.Mesh(geometry, material);
    dodecahedron.position.set(position.x, position.y, position.z);
    scene.add(dodecahedron);

    // ワイヤーフレーム追加
    updateWireframe(dodecahedron, geometry);

    updateGeometry();
}

/**
 * スライダーの値に応じて Dodecahedron のジオメトリを更新する関数
 */
function updateGeometry() {
    radius = parseFloat(radiusSlider.value);
    detail = parseInt(detailSlider.value);
    radiusValue.innerText = radius;
    detailValue.innerText = detail;

    // 既存ジオメトリを破棄し新しいジオメトリを作成
    dodecahedron.geometry.dispose();
    const newGeometry = new THREE.DodecahedronGeometry(radius, detail);
    dodecahedron.geometry = newGeometry;

    // ワイヤーフレーム再作成
    updateWireframe(dodecahedron, newGeometry);
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
 * @param {THREE.Mesh} mesh - アニメーション対象のメッシュ
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
    const enabled = dodecahedron.material.wireframe;
    dodecahedron.material.wireframe = !enabled;
    // ワイヤーフレームメッシュの表示も切り替え
    dodecahedron.children.forEach(child => {
        child.visible = !enabled;
    });
    wireframeToggle.innerText = !enabled ? 'ON' : 'OFF';
});

// Dodecahedron生成
addDodecahedron();

// アニメーション開始
animate(dodecahedron);