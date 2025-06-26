import * as THREE from 'three';
import { Light } from './Light.js';

// DOM取得
const canvasContainer = document.getElementById('canvas-container');
const wireframeValue = document.getElementById('wireframeValue');
const radiusSlider = document.getElementById('radiusSlider');
const tubeSlider = document.getElementById('tubeSlider');
const radialSegSlider = document.getElementById('radialSegSlider');
const tubularSegSlider = document.getElementById('tubularSegSlider');
const arcSlider = document.getElementById('arcSlider');

const radiusValue = document.getElementById('radiusValue');
const tubeValue = document.getElementById('tubeValue');
const radialSegValue = document.getElementById('radialSegValue');
const tubularSegValue = document.getElementById('tubularSegValue');
const arcValue = document.getElementById('arcValue');
const wireframeToggle = document.getElementById('wireframeToggle');

// 変数&定数
let torus;
let radius = 1;
let tube = 0.4;
let radialSegments = 16;
let tubularSegments = 100;
let arc = Math.PI * 2;

const canvasWidth = canvasContainer.clientWidth;
const canvasHeight = canvasContainer.clientHeight;
const speed = 0.01;
const wireColor = 0xff0000;
const backgroundColor = 0xffffff;

// シーン作成
const scene = new THREE.Scene();
// ライトの追加
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
 * トーラスを生成してシーンに追加する関数
 * @param {object} params { color, position }
 */
function addTorus(params = {}) {
    const color = params.color || 0xff0000;
    const position = params.position || { x: 0, y: 0, z: 0 };

    // Geometry作成
    const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
    // Material作成
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    // Mesh作成
    torus = new THREE.Mesh(geometry, material);
    torus.position.set(position.x, position.y, position.z);
    // シーンに追加
    scene.add(torus);
    // ワイヤーフレーム追加
    updateWireframe(torus, geometry);

    updateGeometry();
}

/**
 * スライダーの値に応じてトーラスのジオメトリを更新する関数
 */
function updateGeometry() {
    // スライダーの表示値更新
    radiusValue.innerText = radius = parseFloat(radiusSlider.value);
    tubeValue.innerText = tube = parseFloat(tubeSlider.value);
    radialSegValue.innerText = radialSegments = parseInt(radialSegSlider.value);
    tubularSegValue.innerText = tubularSegments = parseInt(tubularSegSlider.value);
    // arcはラジアンで扱うので、ここでは 0 ～ 2π の範囲にする
    arcValue.innerText = arc = parseFloat(arcSlider.value);

    // 既存ジオメトリを破棄
    torus.geometry.dispose();

    // 新しいジオメトリを作成
    const newGeometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
    torus.geometry = newGeometry;

    // ワイヤーフレームの再作成
    updateWireframe(torus, newGeometry);
}

/**
 * メッシュのワイヤーフレームを更新する
 * @param {THREE.Mesh} mesh - ワイヤーフレームを更新するメッシュ
 * @param {THREE.BufferGeometry} geometry - ワイヤーフレームのジオメトリ
 */
function updateWireframe(mesh, geometry) {
    // 既存の子オブジェクト（ワイヤーフレーム）を削除
    while (mesh.children.length > 0) {
        mesh.remove(mesh.children[0]);
    }
    const wireframe = new THREE.WireframeGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: wireColor });
    const wireframeMesh = new THREE.LineSegments(wireframe, lineMaterial);
    mesh.add(wireframeMesh);
}

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

// スライダーにイベントリスナーを追加
radiusSlider.addEventListener('input', updateGeometry);
tubeSlider.addEventListener('input', updateGeometry);
radialSegSlider.addEventListener('input', updateGeometry);
tubularSegSlider.addEventListener('input', updateGeometry);
arcSlider.addEventListener('input', updateGeometry);

// トグルボタンでワイヤーフレーム切替
wireframeToggle.addEventListener('click', () => {
    const enabled = torus.material.wireframe;
    torus.material.wireframe = !enabled;
    wireframeToggle.innerText = !enabled ? 'ON' : 'OFF';
});

// トーラス生成
addTorus();
animate(torus);
