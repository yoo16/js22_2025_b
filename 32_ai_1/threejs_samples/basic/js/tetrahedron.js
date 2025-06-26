import * as THREE from 'three';
import { Light } from './Light.js'; // 外部の Light.js を利用する場合

// DOM取得
const canvasContainer = document.getElementById('canvas-container');
const tetraWireframeToggle = document.getElementById('wireframeToggle');

const tetraRadiusSlider = document.getElementById('tetraRadiusSlider');
const tetraDetailSlider = document.getElementById('tetraDetailSlider');

const tetraRadiusValue = document.getElementById('tetraRadiusValue');
const tetraDetailValue = document.getElementById('tetraDetailValue');

// 定数
const wireColor = 0xff0000;
const geometryColor = 0xff0000;
const backgroundColor = 0xffffff;
const speed = 0.01;

// シーン作成
const scene = new THREE.Scene();

// カメラ作成（コンテナサイズに合わせる）
const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
camera.position.z = 5;

// レンダラー作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.setClearColor(backgroundColor, 1);
canvasContainer.appendChild(renderer.domElement);

// Light の追加（外部 Light.js を利用）
const light = new Light();
light.add(scene);

// グローバル変数として Tetrahedron オブジェクト
let tetrahedron;

/**
 * TetrahedronGeometry を生成してシーンに追加する関数
 * @param {object} params { radius, detail, color, position }
 */
function addTetrahedron(params = {}) {
    const radius = params.radius !== undefined ? params.radius : 1;
    const detail = params.detail !== undefined ? params.detail : 0;
    const color = params.color || geometryColor;
    const position = params.position || { x: 0, y: 0, z: 0 };

    // TetrahedronGeometry(radius, detail)
    const geometry = new THREE.TetrahedronGeometry(radius, detail);
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    tetrahedron = new THREE.Mesh(geometry, material);
    tetrahedron.position.set(position.x, position.y, position.z);
    scene.add(tetrahedron);

    // ワイヤーフレームを追加
    updateWireframe(tetrahedron, geometry);
}

/**
 * Tetrahedron のジオメトリ更新
 */
function updateGeometry() {
    const radius = parseFloat(tetraRadiusSlider.value);
    const detail = parseInt(tetraDetailSlider.value);

    tetraRadiusValue.innerText = radius;
    tetraDetailValue.innerText = detail;

    const geometory = new THREE.TetrahedronGeometry(radius, detail);
    tetrahedron.geometry.dispose();
    tetrahedron.geometry = geometory;

    // ワイヤーフレームの再作成
    updateWireframe(tetrahedron, geometory);
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


// アニメーションループ
/**
 * メッシュのアニメーションループ
 * @param {THREE.Mesh} mesh - アニメーションするメッシュ
 */
function animate(mesh) {
    requestAnimationFrame(animate.bind(null, mesh));

    mesh.rotation.x += speed;
    mesh.rotation.y += speed;

    renderer.render(scene, camera);
}

// スライダーにイベントリスナー追加
tetraRadiusSlider.addEventListener('input', updateGeometry);
tetraDetailSlider.addEventListener('input', updateGeometry);

// トグルボタンでワイヤーフレーム切替
tetraWireframeToggle.addEventListener('click', () => {
    const enabled = tetrahedron.material.wireframe;
    tetrahedron.material.wireframe = !enabled;
    tetraWireframeToggle.innerText = !enabled ? 'ON' : 'OFF';
});

addTetrahedron();
animate(tetrahedron);