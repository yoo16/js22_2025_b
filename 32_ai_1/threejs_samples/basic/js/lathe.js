import * as THREE from 'three';
import { Light } from './Light.js';

// DOM要素取得
const canvasContainer = document.getElementById('canvas-container');
const wireframeToggle = document.getElementById('wireframeToggle');

const segmentsSlider = document.getElementById('segmentsSlider');
const phiStartSlider = document.getElementById('phiStartSlider');
const phiLengthSlider = document.getElementById('phiLengthSlider');

const segmentsValue = document.getElementById('segmentsValue');
const phiStartValue = document.getElementById('phiStartValue');
const phiLengthValue = document.getElementById('phiLengthValue');

// 変数＆初期値
let latheMesh;
let segments = parseInt(segmentsSlider.value);
let phiStart = parseFloat(phiStartSlider.value);
let phiLength = parseFloat(phiLengthSlider.value);

// キャンバスサイズ
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
camera.position.z = 5;

// レンダラー作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(canvasWidth, canvasHeight);
renderer.setClearColor(backgroundColor, 1);
canvasContainer.appendChild(renderer.domElement);

/**
 * LatheGeometry 用のプロファイルとなる点群を生成する関数
 * ここではシンプルな曲線を用いています。
 */
function generatePoints() {
    const points = [];
    for (let i = 0; i < 10; i++) {
        // 例: x 座標は sin カーブ、y 座標は単純に増加
        points.push(new THREE.Vector2(Math.sin(i * 0.1) + 1, i * 0.1));
    }
    return points;
}

/**
 * LatheGeometry を生成してシーンに追加する関数
 * @param {object} params { color, position }
 */
function addLathe(params = {}) {
    const color = params.color || geometryColor;
    const position = params.position || { x: 0, y: 0, z: 0 };
    const points = generatePoints();

    // LatheGeometry(points, segments, phiStart, phiLength)
    const geometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    latheMesh = new THREE.Mesh(geometry, material);
    latheMesh.position.set(position.x, position.y, position.z);
    scene.add(latheMesh);

    // ワイヤーフレーム追加
    updateWireframe(latheMesh, geometry);
    updateGeometry();
}

/**
 * スライダーの値に応じて LatheGeometry を更新する関数
 */
function updateGeometry() {
    segments = parseInt(segmentsSlider.value);
    phiStart = parseFloat(phiStartSlider.value);
    phiLength = parseFloat(phiLengthSlider.value);

    // 表示更新
    segmentsValue.innerText = segments;
    phiStartValue.innerText = phiStart;
    phiLengthValue.innerText = phiLength;

    // 既存ジオメトリの破棄と新規作成
    const points = generatePoints();
    latheMesh.geometry.dispose();
    const newGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
    latheMesh.geometry = newGeometry;

    // ワイヤーフレーム再作成
    updateWireframe(latheMesh, newGeometry);
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

// スライダーのイベントリスナー
segmentsSlider.addEventListener('input', updateGeometry);
phiStartSlider.addEventListener('input', updateGeometry);
phiLengthSlider.addEventListener('input', updateGeometry);

// ワイヤーフレーム切替
wireframeToggle.addEventListener('click', () => {
    const enabled = latheMesh.material.wireframe;
    latheMesh.material.wireframe = !enabled;
    // 追加したワイヤーフレームメッシュの表示も切替
    latheMesh.children.forEach(child => {
        child.visible = !enabled;
    });
    wireframeToggle.innerText = !enabled ? 'ON' : 'OFF';
});

// LatheGeometry 生成
addLathe();
// アニメーション開始
animate(latheMesh);
