import * as THREE from 'three';

// シーン作成
const scene = new THREE.Scene();

// カメラ作成 (視野角75°、アスペクト比はウィンドウサイズ、近接面0.1～遠方面1000)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// レンダラー作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// 背景を白に設定（カラー：白、アルファ：1）
renderer.setClearColor(0xffffff, 1);
document.body.appendChild(renderer.domElement);

/**
 * 立方体を生成してシーンに追加
 * @return {THREE.Mesh} 立方体のメッシュ
 */
function addBox() {
    const width = 1;
    const height = 1;
    const depth = 1;
    const color = 0xff0000;
    const position = { x: 0, y: 0, z: 0 };

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;
    scene.add(mesh);
    return mesh;
}

/**
 * 球体を生成してシーンに追加
 * @return {THREE.Mesh} 球体のメッシュ
 */
function addSphere(params = {}) {
    const radius = 1;
    const width = 16;
    const height = 16;
    const color = 0xff0000;
    const position = { x: 0, y: 0, z: 0 };

    const geometry = new THREE.SphereGeometry(radius, width, height);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;
    scene.add(mesh);
    return mesh;
}

/**
 * 簡易的なライトを追加
 */
function addLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
}

/**
 * キャンバステクスチャを用いてテキストを描画し、スプライトとして返す
 * @param {string} message 描画するテキスト
 * @param {object} params オプション設定
 * @return {THREE.Sprite} テキストスプライト
 */
function addTextSprite(message, params = {}) {
    const fontface = params.fontface || "Arial";
    const fontsize = params.fontsize || 24;

    // キャンバス要素作成
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = fontsize + "px " + fontface;

    // テキストの幅を測定
    const metrics = context.measureText(message);
    const textWidth = metrics.width;

    canvas.width = textWidth;
    canvas.height = fontsize * 1.4;

    // テキスト描画
    context.fillStyle = "rgba(0, 0, 0, 1.0)";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = fontsize + "px " + fontface;
    context.fillText(message, canvas.width / 2, canvas.height / 2);

    // キャンバスをテクスチャに変換
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });

    // スプライト作成
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(canvas.width / 100, canvas.height / 100, 1.0);
    sprite.position.set(0, 2, 0);

    // プライトをシーンに追加
    scene.add(sprite);
    return sprite;
}

// 立方体と球体をグローバル変数として作成
const cube = addBox();
const sphere = addSphere();

// テキストスプライトを作成し、シーンに追加
const textSprite = addTextSprite("Hello, Three.js!", {
    fontface: "Arial",
    fontsize: 32,
});

addLight();

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);

    // 立方体と球体の回転
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    // テキストスプライトのアニメーション
    // Y軸を中心に上下に揺れる（sin波で振動）
    const time = Date.now() * 0.002;
    textSprite.position.y = 2 + Math.sin(time) * 0.5;
    // Z軸回転
    textSprite.rotation.z += 0.01;

    // レンダリング
    renderer.render(scene, camera);
}
animate();