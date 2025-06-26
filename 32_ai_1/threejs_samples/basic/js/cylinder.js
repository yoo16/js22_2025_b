import * as THREE from 'three';
import { Light } from './Light.js';

// DOM取得
const canvasContainer = document.getElementById('canvas-container');
const wireframeToggle = document.getElementById('wireframeToggle');

const radiusTopSlider = document.getElementById('radiusTopSlider');
const heightSlider = document.getElementById('heightSlider');
const radiusBottomSlider = document.getElementById('radiusBottomSlider');
const radialSegSlider = document.getElementById('radialSegSlider');
const heightSegSlider = document.getElementById('heightSegSlider');

const radiusTopValue = document.getElementById('radiusTopValue');
const heightValue = document.getElementById('heightValue');
const radiusBottomValue = document.getElementById('radiusBottomValue');
const radialSegValue = document.getElementById('radialSegValue');
const heightSegValue = document.getElementById('heightSegValue');

// 変数＆定数
let cylinder;
let radiusTop = 1;
let height = 1;
let radiusBottom = 1;
let radialSegments = 1;
let heightSegments = 1;

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
 * Cylinder を生成してシーンに追加する関数
 * @param {object} params { color, position }
 */
function addCylinder(params = {}) {
    const color = params.color || 0xff0000;
    const position = params.position || { x: 0, y: 0, z: 0 };

    // CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, false, 0, Math.PI * 2);
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(position.x, position.y, position.z);
    scene.add(cylinder);

    // ワイヤーフレーム追加
    updateWireframe(cylinder, geometry);

    updateGeometry();
}

/**
 * Cylinder のジオメトリ更新
 */
function updateGeometry() {
    // スライダーの値取得と表示更新
    radiusTopValue.innerText = radiusTop = parseFloat(radiusTopSlider.value);
    heightValue.innerText = height = parseFloat(heightSlider.value);
    radiusBottomValue.innerText = radiusBottom = parseFloat(radiusBottomSlider.value);
    radialSegValue.innerText = radialSegments = parseInt(radialSegSlider.value);
    heightSegValue.innerText = heightSegments = parseInt(heightSegSlider.value);

    // 新しいジオメトリ生成
    const newGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, false, 0, Math.PI * 2);
    cylinder.geometry.dispose();
    cylinder.geometry = newGeometry;

    // ワイヤーフレームの再作成
    updateWireframe(cylinder, newGeometry);
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

// スライダーにイベントリスナーを追加 (Cylinder)
radiusTopSlider.addEventListener('input', updateGeometry);
heightSlider.addEventListener('input', updateGeometry);
radiusBottomSlider.addEventListener('input', updateGeometry);
radialSegSlider.addEventListener('input', updateGeometry);
heightSegSlider.addEventListener('input', updateGeometry);

// トグルボタンでワイヤーフレーム切替
wireframeToggle.addEventListener('click', () => {
    const enabled = cylinder.material.wireframe;
    cylinder.material.wireframe = !enabled;
    cylinder.children.forEach(child => {
        child.visible = !enabled;
    });
    // ボタンテキスト更新
    wireframeToggle.innerText = !enabled ? 'ON' : 'OFF';
});

// Cylinder生成
addCylinder();
animate(cylinder);