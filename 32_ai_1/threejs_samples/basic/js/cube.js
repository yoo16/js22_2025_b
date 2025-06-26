import * as THREE from 'three';
import { Light } from './Light.js';

// DOM取得
const canvasContainer = document.getElementById('canvas-container');
const wireframeToggle = document.getElementById('wireframeToggle');

const widthSlider = document.getElementById('widthSlider');
const heightSlider = document.getElementById('heightSlider');
const depthSlider = document.getElementById('depthSlider');
const widthSegSlider = document.getElementById('widthSegSlider');
const heightSegSlider = document.getElementById('heightSegSlider');
const depthSegSlider = document.getElementById('depthSegSlider');
const widthValue = document.getElementById('widthValue');
const heightValue = document.getElementById('heightValue');
const depthValue = document.getElementById('depthValue');
const widthSegValue = document.getElementById('widthSegValue');
const heightSegValue = document.getElementById('heightSegValue');
const depthSegValue = document.getElementById('depthSegValue');

// 変数&定数
let cube;
let width = 1;
let height = 1;
let depth = 1;
let widthSeg = 1;
let heightSeg = 1;
let depthSeg = 1;

const canvasWidth = canvasContainer.clientWidth;
const canvasHeight = canvasContainer.clientHeight;
const speed = 0.01;
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
 * 立方体を生成してシーンに追加する関数
 * @param {object} params { color, position }
 */
function addBox(params = {}) {
    const color = params.color || 0xff0000;
    const position = params.position || { x: 0, y: 0, z: 0 };

    // Geometry作成
    const geometry = new THREE.BoxGeometry(width, height, depth, widthSeg, heightSeg, depthSeg);
    // Material作成
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    // Mesh作成
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(position.x, position.y, position.z);
    // シーンに追加
    scene.add(cube);
    // ワイヤーフレーム追加
    updateWireframe(cube, geometry);

    updateGeometry();
}

// スライダーの値に応じて立方体のジオメトリを更新する関数
function updateGeometry() {
    // スライダーの表示値更新
    widthValue.innerText = width = parseFloat(widthSlider.value);
    heightValue.innerText = height = parseFloat(heightSlider.value);
    depthValue.innerText = depth = parseFloat(depthSlider.value);
    widthSegValue.innerText = widthSeg = parseInt(widthSegSlider.value);
    heightSegValue.innerText = heightSeg = parseInt(heightSegSlider.value);
    depthSegValue.innerText = depthSeg = parseInt(depthSegSlider.value);

    // ジオメトリを破棄
    cube.geometry.dispose();

    // 新しいジオメトリを作成
    const newGeometry = new THREE.BoxGeometry(width, height, depth, widthSeg, heightSeg, depthSeg);
    cube.geometry = newGeometry;

    // ワイヤーフレームの再作成
    updateWireframe(cube, newGeometry);
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
    const lineMaterial = new THREE.LineBasicMaterial({ color: wireColor});
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
widthSlider.addEventListener('input', updateGeometry);
heightSlider.addEventListener('input', updateGeometry);
depthSlider.addEventListener('input', updateGeometry);
widthSegSlider.addEventListener('input', updateGeometry);
heightSegSlider.addEventListener('input', updateGeometry);
depthSegSlider.addEventListener('input', updateGeometry);

// トグルボタンでワイヤーフレーム切替
wireframeToggle.addEventListener('click', () => {
    const enabled = cube.material.wireframe;
    cube.material.wireframe = !enabled;
    wireframeToggle.innerText = !enabled ? 'ON' : 'OFF';
});

// 立方体生成
addBox();
animate(cube);