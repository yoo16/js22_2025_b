// DOM取得
const videoEl = document.getElementById('video');
const canvasEl = document.getElementById('canvas');
const partSelectEl = document.getElementById('partSelect'); // 追加
const messageEl = document.getElementById('message');

// キャンバスのコンテキスト
const ctx = canvasEl.getContext('2d');

// 映像サイズ
const videoWidth = 640;
const videoHeight = 480;

// 顔検出器
let detector;
// デフォルトは鼻
let selectedPart = "nose";

/**
 * 顔検出機械学習モデルの設定
 */
async function loadModel() {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
    };
    // TODO: 「MediaPipeFaceMesh」モデルを設定して、検出器(detector)を作成
    detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
}

/**
 * Webカメラを有効化
 */
async function setupCamera() {
    const config = {
        video: {
            width: videoWidth,
            height: videoHeight,
            facingMode: 'user'
        },
        audio: false,
    };
    // カメラストリームを取得
    const stream = await navigator.mediaDevices.getUserMedia(config);
    videoEl.srcObject = stream;
    // ビデオ再生
    await videoEl.play();
}

/**
 * 顔検出処理して顔検出データを返す
 */
async function detectFace() {
    const estimationConfig = { flipHorizontal: false };
    // TODO: 顔検出を実装
    // const faces = await detector.estimateFaces(videoEl, estimationConfig);
    // return faces;
}

/**
 * 顔検出結果を描画
 */
function drawResults(faces) {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.fillStyle = 'red';

    if (faces && faces.length > 0) {
        // 顔検出データを繰り返し
        faces.forEach((face) => {
            // ランドマークまたはキーポイントの取得
            const landmarks = face.landmarks || face.keypoints;

            landmarks.forEach((point, index) => {
                // 選択された部位のみ描画
                if (selectedLandmarkParts.includes(index)) {
                    // TODO: ランドマークの座標をキャンバスに描画
                    // X座標 * キャンバスの幅 / ビデオの幅
                    // Y座標 * キャンバスの高さ / ビデオの高さ
                    const x = 0;
                    const y = 0;

                    // 点を描画
                    ctx.beginPath();
                    ctx.arc(x, y, 1, 0, 2 * Math.PI);
                    ctx.fill();
                }
            });
        });
    }
}

/**
 * 部位を変更する処理
 */
function changePart() {
    selectedPart = partSelectEl.value;
    // 顔部位のランドマーク番号取得
    selectedLandmarkParts = landmarkParts[selectedPart]
    // console.log(`Selected part: ${selectedPart}`);
    // console.log(`Landmark parts: ${selectedLandmarkParts}`);
    messageEl.innerHTML = JSON.stringify(selectedLandmarkParts);
}

/**
 * ランドマークのレンダリング
 */
async function render() {
    // 顔認識してランドマークを取得
    const faces = await detectFace();
    // 顔検出データを描画
    drawResults(faces);
    // 次のフレームをリクエスト
    requestAnimationFrame(render);
}

/**
 * 顔選択プルダウンレンダリング
 */
function renderSelect() {
    Object.keys(landmarkParts).forEach((key) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        partSelectEl.appendChild(option);
    });
}

/**
 * メインアプリケーション
 */
async function app() {
    // プルダウン初期化
    renderSelect();
    // 初期部位設定
    changePart();
    // モデル読み込み
    await loadModel();
    // カメラセットアップ
    await setupCamera();
    // レンダリング開始
    render();
}

// イベントリスナー追加
partSelectEl.addEventListener('change', changePart);

// アプリ起動
app();