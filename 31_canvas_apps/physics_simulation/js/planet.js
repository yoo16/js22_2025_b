// 色設定
const backgroundColor = '#ffffff';
const orbitLineColor = '#000000';
const pointLightColor = '#ffffff';

// シーンの初期化
const scene = new THREE.Scene();
scene.background = new THREE.Color(backgroundColor);

// カメラの初期位置と向き
const defaultCameraPosition = new THREE.Vector3(0, 150, 250);
const defaultLookAt = new THREE.Vector3(0, 0, 0);

// カメラの設定
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1500);
camera.position.copy(defaultCameraPosition);
// カメラの向きを設定
camera.lookAt(defaultLookAt);

// WebGLレンダリング
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// TODO: シーンに太陽を追加
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(10, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff5500 })
);
scene.add(sun);

// TODO: --- 環境光 ---
const pointLight = new THREE.PointLight(pointLightColor, 1.5, 0);
pointLight.position.copy(sun.position);
scene.add(pointLight);

// --- 惑星 ---
const planets = [];

planetData.forEach(data => {
    // 惑星ジオメトリ（球体）作成
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    // マテリアル作成
    const material = new THREE.MeshPhongMaterial({ color: data.color });
    // メッシュの作成
    const mesh = new THREE.Mesh(geometry, material);
    // TODO: 惑星をシーンに追加
    scene.add(mesh);

    // 軌道リング
    const segments = 128;
    const orbitPoints = [];
    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        orbitPoints.push(new THREE.Vector3(
            data.orbitRadius * Math.cos(angle),
            0,
            data.orbitRadius * Math.sin(angle)
        ));
    }
    // 軌道ラインのジオメトリとマテリアルを作成
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    // 軌道ラインのメッシュを作成
    const orbitLine = new THREE.LineLoop(
        orbitGeometry,
        new THREE.LineBasicMaterial({ color: orbitLineColor, transparent: true, opacity: 0.3 })
    );
    // シーンに追加
    scene.add(orbitLine);

    // 惑星のデータを保存
    planets.push({
        name: data.name,
        mesh: mesh,
        orbitRadius: data.orbitRadius,
        orbitPeriod: data.orbitPeriod
    });
});

// --- DOMリスト生成とズーム処理 ---
const planetListEl = document.querySelector('#planetList ul');
let isZooming = false;
let zoomStart = new THREE.Vector3();
let zoomEnd = new THREE.Vector3();
let zoomLookAt = new THREE.Vector3();
let zoomProgress = 0;
let trackedPlanet = null;

// クリックしてズーム
planets.forEach(planet => {
    const li = document.createElement('li');
    li.textContent = planet.name;
    li.addEventListener('click', () => {
        // ズーム
        zoomStart.copy(camera.position);
        zoomLookAt.copy(planet.mesh.position);
        zoomEnd.copy(zoomLookAt).add(new THREE.Vector3(0, 10, 20));
        zoomProgress = 0;
        isZooming = true;
        // 追跡惑星設定
        trackedPlanet = planet;
    });
    planetListEl.appendChild(li);
});

// ズームリセット
document.getElementById('resetButton').addEventListener('click', () => {
    zoomStart.copy(camera.position);
    zoomEnd.copy(defaultCameraPosition);
    zoomLookAt.copy(defaultLookAt);
    zoomProgress = 0;
    isZooming = true;
    trackedPlanet = null;
});

// アニメーション
function animate() {
    requestAnimationFrame(animate);
    const elapsed = performance.now() / 1000;

    // 惑星の軌道更新
    planets.forEach(planet => {
        const angle = (elapsed / planet.orbitPeriod) * Math.PI * 2;
        planet.mesh.position.x = planet.orbitRadius * Math.cos(angle);
        planet.mesh.position.z = planet.orbitRadius * Math.sin(angle);
    });

    // カメラズーム補間
    if (isZooming) {
        // ズームをなめらかにする
        zoomProgress += 0.02;
        if (zoomProgress >= 1) {
            zoomProgress = 1;
            isZooming = false;
        }
        // カメラの位置を補間
        camera.position.lerpVectors(zoomStart, zoomEnd, zoomProgress);
        // カメラの向きを補間
        camera.lookAt(zoomLookAt);
    } else if (trackedPlanet) {
        // TODO: ズーム完了後に惑星を追跡
        const offset = new THREE.Vector3(0, 10, 20);
        camera.position.copy(trackedPlanet.mesh.position).add(offset);
        camera.lookAt(trackedPlanet.mesh.position);
    }
    // レンダリング
    renderer.render(scene, camera);
}

// --- リサイズ対応 ---
window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// アニメーション開始
animate();
