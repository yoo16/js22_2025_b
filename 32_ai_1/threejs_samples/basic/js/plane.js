import * as THREE from 'three';
import { Light } from './Light.js';

// DOM取得
const canvasContainer = document.getElementById('canvas-container');
const wireframeToggle = document.getElementById('wireframeToggle');

const planeWidthSlider = document.getElementById('planeWidthSlider');
const planeHeightSlider = document.getElementById('planeHeightSlider');
const planeWidthSegSlider = document.getElementById('planeWidthSegSlider');
const planeHeightSegSlider = document.getElementById('planeHeightSegSlider');

const planeWidthValue = document.getElementById('planeWidthValue');
const planeHeightValue = document.getElementById('planeHeightValue');
const planeWidthSegValue = document.getElementById('planeWidthSegValue');
const planeHeightSegValue = document.getElementById('planeHeightSegValue');

// 変数＆定数
let plane;
let width = 1;
let height = 1;
let widthSeg = 1;
let heightSeg = 1;

const canvasWidth = canvasContainer.clientWidth;
const canvasHeight = canvasContainer.clientHeight;
const wireColor = 0xff0000;
const geometryColor = 0xff0000;
const backgroundColor = 0xffffff;
const speed = 0.01;

// シーン作成
const scene = new THREE.Scene();

// カメラ作成 (視野角75°、アスペクト比はコンテナサイズ、近接面0.1～遠方面1000)
const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
camera.position.z = 5;

// レンダラー作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(canvasWidth, canvasHeight);
renderer.setClearColor(backgroundColor, 1);
canvasContainer.appendChild(renderer.domElement);

// ライト追加
const light = new Light();
light.add(scene);

/**
 * Plane を生成してシーンに追加する関数
 * @param {object} params { color, position }
 */
function addPlane(params = {}) {
    const color = params.color || geometryColor;
    const position = params.position || { x: 0, y: 0, z: 0 };

    const geometry = new THREE.PlaneGeometry(width, height, widthSeg, heightSeg);
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    plane = new THREE.Mesh(geometry, material);
    plane.position.set(position.x, position.y, position.z);
    scene.add(plane);

    // ワイヤーフレーム追加
    updateWireframe(plane, geometry);
}

// Plane のジオメトリ更新
function updatePlaneGeometry() {
    // 表示値更新
    planeWidthValue.innerText = width = parseFloat(planeWidthSlider.value);
    planeHeightValue.innerText = height = parseFloat(planeHeightSlider.value);
    planeWidthSegValue.innerText = widthSeg = parseInt(planeWidthSegSlider.value);
    planeHeightSegValue.innerText = heightSeg = parseInt(planeHeightSegSlider.value);

    // 新しいジオメトリ生成
    const geometry = new THREE.PlaneGeometry(width, height, widthSeg, heightSeg);
    plane.geometry.dispose();
    plane.geometry = geometry;

    // ワイヤーフレーム再作成
    updateWireframe(plane, geometry);
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
 * メッシュのアニメーションループ
 * @param {THREE.Mesh} mesh - アニメーションするメッシュ
 */
function animate(mesh) {
    requestAnimationFrame(animate.bind(null, mesh));

    mesh.rotation.x += speed;
    mesh.rotation.y += speed;

    renderer.render(scene, camera);
}

// イベントリスナー追加 (Plane)
planeWidthSlider.addEventListener('input', updatePlaneGeometry);
planeHeightSlider.addEventListener('input', updatePlaneGeometry);
planeWidthSegSlider.addEventListener('input', updatePlaneGeometry);
planeHeightSegSlider.addEventListener('input', updatePlaneGeometry);

// トグルボタンでワイヤーフレーム切替 
wireframeToggle.addEventListener('click', () => {
    const enabled = plane.material.wireframe;
    plane.material.wireframe = !enabled;
    wireframeToggle.innerText = !enabled ? 'ON' : 'OFF';
});

addPlane();
animate(plane);