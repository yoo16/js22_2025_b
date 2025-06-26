import * as THREE from 'three';
import { Light } from './Light.js'; // 外部の Light.js を利用する場合

// DOM取得
const canvasContainer = document.getElementById('canvas-container');
const circleWireframeToggle = document.getElementById('circleWireframeToggle');

const circleRadiusSlider = document.getElementById('circleRadiusSlider');
const circleSegSlider = document.getElementById('circleSegSlider');
const thetaStartSlider = document.getElementById('thetaStartSlider');
const thetaLengthSlider = document.getElementById('thetaLengthSlider');

const circleRadiusValue = document.getElementById('circleRadiusValue');
const circleSegValue = document.getElementById('circleSegValue');
const thetaStartValue = document.getElementById('thetaStartValue');
const thetaLengthValue = document.getElementById('thetaLengthValue');

// 変数＆定数
let circle;

const wireColor = 0xff0000;
const geometryColor = 0xff0000;
const backgroundColor = 0xffffff;
const speed = 0.01;

// シーン作成
const scene = new THREE.Scene();

// カメラ作成（コンテナサイズに合わせる）
const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
camera.position.z = 10;

// レンダラー作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.setClearColor(backgroundColor, 1);
canvasContainer.appendChild(renderer.domElement);

// Light の追加（外部 Light.js を利用）
const light = new Light();
light.add(scene);

// 初期パラメータ
let radius = parseFloat(circleRadiusSlider.value);
let segments = parseInt(circleSegSlider.value);
let thetaStart = parseFloat(thetaStartSlider.value);
let thetaLength = parseFloat(thetaLengthSlider.value);

/**
 * Circle を生成してシーンに追加する関数
 * @param {object} params { radius, segments, thetaStart, thetaLength, color, position }
 */
function addCircle(params = {}) {
    radius = params.radius !== undefined ? params.radius : 5;
    segments = params.segments !== undefined ? params.segments : 32;
    thetaStart = params.thetaStart !== undefined ? params.thetaStart : 0;
    thetaLength = params.thetaLength !== undefined ? params.thetaLength : Math.PI * 2;
    const color = params.color || geometryColor;
    const position = params.position || { x: 0, y: 0, z: 0 };

    const geometry = new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength);
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    circle = new THREE.Mesh(geometry, material);
    circle.position.set(position.x, position.y, position.z);
    scene.add(circle);

    // ワイヤーフレーム追加
    updateWireframe(circle, geometry);
}

/**
 * Circle のジオメトリ更新
 */
function updateCircleGeometry() {
    radius = parseFloat(circleRadiusSlider.value);
    segments = parseInt(circleSegSlider.value);
    thetaStart = parseFloat(thetaStartSlider.value);
    thetaLength = parseFloat(thetaLengthSlider.value);

    circleRadiusValue.innerText = radius;
    circleSegValue.innerText = segments;
    thetaStartValue.innerText = thetaStart.toFixed(2);
    thetaLengthValue.innerText = thetaLength.toFixed(2);

    const geometry = new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength);
    circle.geometry.dispose();
    circle.geometry = geometry;

    updateWireframe(circle, geometry);
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

// イベントリスナー追加
circleRadiusSlider.addEventListener('input', updateCircleGeometry);
circleSegSlider.addEventListener('input', updateCircleGeometry);
thetaStartSlider.addEventListener('input', updateCircleGeometry);
thetaLengthSlider.addEventListener('input', updateCircleGeometry);

// トグルボタンでワイヤーフレーム切替
circleWireframeToggle.addEventListener('click', () => {
    const enabled = circle.material.wireframe;
    circle.material.wireframe = !enabled;
    circle.children.forEach(child => {
        child.visible = !enabled;
    });
    circleWireframeToggle.innerText = !enabled ? 'ON' : 'OFF';
});

addCircle();
animate(circle);