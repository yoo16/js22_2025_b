import * as THREE from 'three';
import { Light } from './Light.js';

// DOM 要素取得
const canvasContainer = document.getElementById('canvas-container');
const wireframeToggle = document.getElementById('wireframeToggle');

const curveSegmentsSlider = document.getElementById('curveSegmentsSlider');
const scaleSlider = document.getElementById('scaleSlider');

const curveSegmentsValue = document.getElementById('curveSegmentsValue');
const scaleValue = document.getElementById('scaleValue');

// 初期パラメータ
let shapeMesh;
let curveSegments = parseInt(curveSegmentsSlider.value);
let shapeScale = parseFloat(scaleSlider.value);

// キャンバスサイズ（リサイズ処理は含まれません）
const canvasWidth = canvasContainer.clientWidth;
const canvasHeight = canvasContainer.clientHeight;
const speed = 0.01;
const geometryColor = 0xff0000;
const wireColor = 0xff0000;
const backgroundColor = 0xffffff;

// シーン作成
const scene = new THREE.Scene();
// ライト追加（Light.js 内のクラスを使用）
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
 * ハート型のシェイプを生成する関数
 * （Three.js のサンプルにもあるハートシェイプ）
 */
function createHeartShape() {
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo( x + 5, y + 5 );
    heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
    heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7, x - 6, y + 7 );
    heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
    heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
    heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
    heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

    return heartShape;
}

/**
 * ShapeGeometry を生成してシーンに追加する関数
 * @param {object} params { color, position }
 */
function addShape(params = {}) {
    const color = params.color || geometryColor;
    const position = params.position || { x: 0, y: 0, z: 0 };
    
    const shape = createHeartShape();
    
    // ShapeGeometry( shape, curveSegments )
    const geometry = new THREE.ShapeGeometry(shape, curveSegments);
    const material = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide, wireframe: false });
    shapeMesh = new THREE.Mesh(geometry, material);
    shapeMesh.position.set(position.x, position.y, position.z);
    shapeMesh.scale.set(0.1, 0.1, 0.1);
    scene.add(shapeMesh);

    // ワイヤーフレーム追加
    updateWireframe(shapeMesh, geometry);
    updateGeometry();
}

/**
 * スライダーの値に応じて ShapeGeometry を更新する関数
 */
function updateGeometry() {
    curveSegments = parseInt(curveSegmentsSlider.value);
    shapeScale = parseFloat(scaleSlider.value);

    // 表示更新
    curveSegmentsValue.innerText = curveSegments;
    scaleValue.innerText = shapeScale;

    // 生成するシェイプを再作成（ハート型）
    const shape = createHeartShape();

    shapeMesh.geometry.dispose();
    const newGeometry = new THREE.ShapeGeometry(shape, curveSegments);
    shapeMesh.geometry = newGeometry;

    // ワイヤーフレーム再作成
    updateWireframe(shapeMesh, newGeometry);
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
 * @param {THREE.Mesh} mesh - 対象メッシュ
 */
function animate(mesh) {
    requestAnimationFrame(animate.bind(null, mesh));
    mesh.rotation.x += speed;
    mesh.rotation.y += speed;
    renderer.render(scene, camera);
}

// スライダーのイベントリスナー
curveSegmentsSlider.addEventListener('input', updateGeometry);
scaleSlider.addEventListener('input', updateGeometry);

// ワイヤーフレーム切替ボタン
wireframeToggle.addEventListener('click', () => {
    const enabled = shapeMesh.material.wireframe;
    shapeMesh.material.wireframe = !enabled;
    wireframeToggle.innerText = !enabled ? 'ON' : 'OFF';
});

// ShapeGeometry 生成
addShape();
// アニメーション開始
animate(shapeMesh);