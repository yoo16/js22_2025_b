import * as THREE from 'three';
import { Light } from './Light.js';

// DOM取得
const canvasContainer = document.getElementById('canvas-container');
const wireframeToggle = document.getElementById('wireframeToggle');

const radiusSlider = document.getElementById('radiusSlider');
const widthSegSlider = document.getElementById('widthSegSlider');
const heightSegSlider = document.getElementById('heightSegSlider');
const radiusValue = document.getElementById('radiusValue');
const widthSegValue = document.getElementById('widthSegValue');
const heightSegValue = document.getElementById('heightSegValue');


// 変数&定数
let sphere;
let radius = 1;
let widthSeg = 1;
let heightSeg = 1;

const canvasWidth = canvasContainer.clientWidth;
const canvasHeight = canvasContainer.clientHeight;
const speed = 0.01;
const sphereColor = 0xff0000;
const wireColor = 0xff0000
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
 * Sphere を生成してシーンに追加する関数
 * @param {object} params { color, position }
 */
function addSphere(params = {}) {
    const color = params.color || sphereColor;
    const position = params.position || { x: 0, y: 0, z: 0 };

    // Geometry作成
    const geometry = new THREE.SphereGeometry(radius, widthSeg, heightSeg);
    // Material作成
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    // Mesh作成
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(position.x, position.y, position.z);
    // シーンに追加
    scene.add(sphere);
    // ワイヤーフレーム追加
    updateWireframe(sphere, geometry);

    updateGeometry();
}

// Sphere のジオメトリ更新
function updateGeometry() {
    // スライダーの表示値更新
    radiusValue.innerText = radius = parseFloat(radiusSlider.value);
    widthSegValue.innerText = widthSeg = parseInt(widthSegSlider.value);
    heightSegValue.innerText = heightSeg = parseInt(heightSegSlider.value);

    // ジオメトリを破棄
    sphere.geometry.dispose();

    // 新しいジオメトリを作成
    const newGeometry = new THREE.SphereGeometry(radius, widthSeg, heightSeg);
    sphere.geometry = newGeometry;

    // ワイヤーフレームの再作成
    updateWireframe(sphere, newGeometry);
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

// スライダーにイベントリスナーを追加 (Sphere)
radiusSlider.addEventListener('input', updateGeometry);
widthSegSlider.addEventListener('input', updateGeometry);
heightSegSlider.addEventListener('input', updateGeometry);

// トグルボタンでワイヤーフレーム切替 (Sphere)
wireframeToggle.addEventListener('click', () => {
    const enabled = sphere.material.wireframe;
    sphere.material.wireframe = !enabled;
    wireframeToggle.innerText = !enabled ? 'ON' : 'OFF';
});

addSphere();
animate(sphere);