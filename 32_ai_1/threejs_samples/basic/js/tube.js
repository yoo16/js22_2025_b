import * as THREE from 'three';
import { Light } from './Light.js';
import { CustomSinCurve } from './CustomSinCurve.js';

// DOM取得
const canvasContainer = document.getElementById('canvas-container');
const wireframeToggle = document.getElementById('wireframeToggle');
const closedToggle = document.getElementById('closedToggle');

const tubularSegSlider = document.getElementById('tubularSegSlider');
const tubeRadiusSlider = document.getElementById('tubeRadiusSlider');
const radialSegSlider = document.getElementById('radialSegSlider');

const tubularSegValue = document.getElementById('tubularSegValue');
const tubeRadiusValue = document.getElementById('tubeRadiusValue');
const radialSegValue = document.getElementById('radialSegValue');

// 初期パラメータ
let tube;
let tubularSegments = parseInt(tubularSegSlider.value);
let tubeRadius = parseFloat(tubeRadiusSlider.value);
let radialSegments = parseInt(radialSegSlider.value);
let closed = false; // 初期はパスは開いている

const canvasWidth = canvasContainer.clientWidth;
const canvasHeight = canvasContainer.clientHeight;
const speed = 0.01;
const geometryColor = 0xff0000;
const wireColor = 0xff0000;
const backgroundColor = 0xffffff;

// シーン作成
const scene = new THREE.Scene();
// ライト追加
const light = new Light();
light.add(scene);

// カメラ作成
const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
camera.position.z = 10;

// レンダラー作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(canvasWidth, canvasHeight);
renderer.setClearColor(backgroundColor, 1);
canvasContainer.appendChild(renderer.domElement);

// パス作成（カスタムSinカーブ）
const path = new CustomSinCurve(4);

/**
 * TubeGeometry を生成してシーンに追加する関数
 * @param {object} params { color, position }
 */
function addTube(params = {}) {
    const color = params.color || geometryColor;
    const position = params.position || { x: 0, y: 0, z: 0 };

    // TubeGeometry(path, tubularSegments, radius, radialSegments, closed)
    const geometry = new THREE.TubeGeometry(path, tubularSegments, tubeRadius, radialSegments, closed);
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    tube = new THREE.Mesh(geometry, material);
    tube.position.set(position.x, position.y, position.z);
    scene.add(tube);

    // ワイヤーフレーム追加
    updateWireframe(tube, geometry);
    updateGeometry();
}

/**
 * スライダー・トグルの値に応じて TubeGeometry を更新する関数
 */
function updateGeometry() {
    // 値の更新と表示
    tubularSegments = parseInt(tubularSegSlider.value);
    tubeRadius = parseFloat(tubeRadiusSlider.value);
    radialSegments = parseInt(radialSegSlider.value);
    tubularSegValue.innerText = tubularSegments;
    tubeRadiusValue.innerText = tubeRadius;
    radialSegValue.innerText = radialSegments;

    // 既存ジオメトリを破棄して新規作成
    tube.geometry.dispose();
    const newGeometry = new THREE.TubeGeometry(path, tubularSegments, tubeRadius, radialSegments, closed);
    tube.geometry = newGeometry;

    // ワイヤーフレーム再作成
    updateWireframe(tube, newGeometry);
}

/**
 * ワイヤーフレームを更新する関数
 * @param {THREE.Mesh} mesh - 対象メッシュ
 * @param {THREE.Geometry} geometry - ワイヤーフレーム用ジオメトリ
 */
function updateWireframe(mesh, geometry) {
    // 既存のワイヤーフレーム削除
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

// イベントリスナー
tubularSegSlider.addEventListener('input', updateGeometry);
tubeRadiusSlider.addEventListener('input', updateGeometry);
radialSegSlider.addEventListener('input', updateGeometry);

// ワイヤーフレーム切替
wireframeToggle.addEventListener('click', () => {
    const enabled = tube.material.wireframe;
    tube.material.wireframe = !enabled;
    // ワイヤーフレームメッシュの表示切替
    tube.children.forEach(child => {
        child.visible = !enabled;
    });
    wireframeToggle.innerText = !enabled ? 'ON' : 'OFF';
});

// Closed 切替
closedToggle.addEventListener('click', () => {
    closed = !closed;
    closedToggle.innerText = closed ? 'ON' : 'OFF';
    updateGeometry();
});

// Tube 生成
addTube();
// アニメーション開始
animate(tube);