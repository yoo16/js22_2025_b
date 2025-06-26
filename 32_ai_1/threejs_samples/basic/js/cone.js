import * as THREE from 'three';
import { Light } from './Light.js';

// DOM 要素の取得
const canvasContainer = document.getElementById('canvas-container');
const wireframeToggle = document.getElementById('wireframeToggle');

const radiusSlider = document.getElementById('radiusSlider');
const heightSlider = document.getElementById('heightSlider');
const radialSegSlider = document.getElementById('radialSegSlider');
const heightSegSlider = document.getElementById('heightSegSlider');

const radiusValue = document.getElementById('radiusValue');
const heightValue = document.getElementById('heightValue');
const radialSegValue = document.getElementById('radialSegValue');
const heightSegValue = document.getElementById('heightSegValue');

// 初期パラメータ
let cone;
let radius = parseFloat(radiusSlider.value);           // Coneの底部半径
let height = parseFloat(heightSlider.value);           // 高さ
let radialSegments = parseInt(radialSegSlider.value);    // 円周分割数（最小3）
let heightSegments = parseInt(heightSegSlider.value);    // 高さ方向分割数

const canvasWidth = canvasContainer.clientWidth;
const canvasHeight = canvasContainer.clientHeight;
const speed = 0.01;
const wireColor = 0xff0000;
const backgroundColor = 0xffffff;

// シーン作成
const scene = new THREE.Scene();

// ライト追加 (Light.js 内のクラスを使用)
const light = new Light();
light.add(scene);

// カメラ作成
const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
camera.position.z = 5;

// レンダラー作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(canvasWidth, canvasHeight);
renderer.setClearColor(backgroundColor, 1);
canvasContainer.appendChild(renderer.domElement);

/**
 * Cone を生成してシーンに追加する関数
 * @param {object} params { color, position }
 */
function addCone(params = {}) {
    const color = params.color || 0xff0000;
    const position = params.position || { x: 0, y: 0, z: 0 };

    // ConeGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
    const geometry = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments, false, 0, Math.PI * 2);
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    cone = new THREE.Mesh(geometry, material);
    cone.position.set(position.x, position.y, position.z);
    scene.add(cone);

    // ワイヤーフレーム追加
    updateWireframe(cone, geometry);

    updateGeometry();
}

/**
 * Cone のジオメトリを更新する関数
 */
function updateGeometry() {
    // スライダーから値を取得し表示更新
    radiusValue.innerText = radius = parseFloat(radiusSlider.value);
    heightValue.innerText = height = parseFloat(heightSlider.value);
    radialSegValue.innerText = radialSegments = parseInt(radialSegSlider.value);
    heightSegValue.innerText = heightSegments = parseInt(heightSegSlider.value);

    // 新しいジオメトリ作成
    const geometory = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments, false, 0, Math.PI * 2);
    cone.geometry.dispose();
    cone.geometry = geometory;

    // ワイヤーフレーム再作成
    updateWireframe(cone, geometory);
}

/**
 * メッシュのワイヤーフレームを更新する
 * @param {THREE.Mesh} mesh - ワイヤーフレームを更新するメッシュ
 * @param {THREE.Geometry} geometory - ワイヤーフレームのジオメトリ
 */
function updateWireframe(mesh, geometory) {
    while (mesh.children.length > 0) {
        mesh.remove(mesh.children[0]);
    }
    const wireframe = new THREE.WireframeGeometry(geometory);
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

// スライダーにイベントリスナーを追加
radiusSlider.addEventListener('input', updateGeometry);
heightSlider.addEventListener('input', updateGeometry);
radialSegSlider.addEventListener('input', updateGeometry);
heightSegSlider.addEventListener('input', updateGeometry);

// ワイヤーフレーム切替ボタン
wireframeToggle.addEventListener('click', () => {
    const enabled = cone.material.wireframe;
    cone.material.wireframe = !enabled;
    // ワイヤーフレームメッシュの表示切替
    cone.children.forEach(child => {
        child.visible = !enabled;
    });
    wireframeToggle.innerText = !enabled ? 'ON' : 'OFF';
});

// Cone 生成
addCone({ position: { x: 0, y: 0, z: 0 } });

// アニメーション開始
animate(cone);