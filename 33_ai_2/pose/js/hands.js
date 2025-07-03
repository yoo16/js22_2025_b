const video = document.getElementById('webcam');
const canvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d');

let detector;
let currentSpokenNumber = 0;      // 直前に再生された数字（連続再生防止用）
let lastNumber = 0;            // 最後に認識された指の本数
const thumbAngleThreshold = 50; // 親指の角度しきい値（度）

canvas.width = 640;
canvas.height = 480;

// 手のランドマークの接続定義（MediaPipe Handsの仕様に基づく）
const fingers = [
    [0, 1, 2, 3, 4],     // 親指
    [0, 5, 6, 7, 8],     // 人差し指
    [0, 9, 10, 11, 12],  // 中指
    [0, 13, 14, 15, 16], // 薬指
    [0, 17, 18, 19, 20]  // 小指
];

/**
 * Webカメラのセットアップ
 */
async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
    });
    video.srcObject = stream;
    await video.play();
}

/**
 * モデルの初期化
 */
async function setupModel() {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    detector = await handPoseDetection.createDetector(model, {
        runtime: 'mediapipe',
        modelType: 'full',
        maxHands: 1,
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
    });
}

/**
 * 手のランドマークと骨格を描画
 */
function drawHand(keypoints) {
    // チェックボックスで骨格表示のオンオフを制御
    const showSkeleton = document.getElementById('toggleSkeleton').checked;
    if (!showSkeleton) return;

    // 骨格ライン
    fingers.forEach(finger => {
        ctx.beginPath();
        finger.forEach((idx, i) => {
            // キーポイントの取得: keypoints をインデックスで参照
            const pt = keypoints[idx];
            // キーポイントの座標をキャンバスサイズに合わせて変換
            const x = pt.x * canvas.width / video.videoWidth;
            const y = pt.y * canvas.height / video.videoHeight;
            // TODO: 最初の点はmoveTo、それ以外はlineTo
            // if (i === 0) {
            //     ctx.moveTo(x, y);
            // } else {
            //     ctx.lineTo(x, y);
            // }
        });
        ctx.strokeStyle = 'cyan';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // TODO: 関節点
    keypoints.forEach(point => {
        // const x = point.x * canvas.width / video.videoWidth;
        // const y = point.y * canvas.height / video.videoHeight;
        // ctx.beginPath();
        // ctx.arc(x, y, 3, 0, 2 * Math.PI);
        // ctx.fillStyle = 'red';
        // ctx.fill();
    });
}

/**
 * 指の本数をカウント（右手基準）
 */
function countExtendedFingers(keypoints) {
    let count = 0;

    // 親指（角度で判定）
    if (isThumbExtended(keypoints)) count++;

    // TODO: 他の指（tipが中間関節より上）
    if (keypoints[0].y < keypoints[0].y) count++;   // 人差し指:8 < 6
    if (keypoints[0].y < keypoints[0].y) count++; // 中指: 12 < 10
    if (keypoints[0].y < keypoints[0].y) count++; // 薬指: 16 < 14
    if (keypoints[0].y < keypoints[0].y) count++; // 小指: 20 < 18

    return count;
}

/**
 * 親指が伸びているかどうかをベクトルの角度から判定
 */
function isThumbExtended(keypoints) {
    // 親指のキーポイントを取得
    const wrist = keypoints[0]; // 手首: 0
    const mcp = keypoints[2]; // 母指中手骨（親指の根元）: 2
    const tip = keypoints[4]; // 親指先端: 4

    // ベクトル1: wrist → mcp, ベクトル2: mcp → tip
    const v1 = { x: mcp.x - wrist.x, y: mcp.y - wrist.y };
    const v2 = { x: tip.x - mcp.x, y: tip.y - mcp.y };

    // 内積から角度を計算（cosθ = A・B / |A||B|）
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.hypot(v1.x, v1.y);
    const mag2 = Math.hypot(v2.x, v2.y);
    const cosAngle = dot / (mag1 * mag2);
    // ラジアン → 度
    const angle = Math.acos(cosAngle) * (180 / Math.PI);

    // TODO: 角度が一定以上なら「伸びている」と判定
    return angle < 0;
}

/**
 * 指の本数をカウントしてキャンバスに描画
 * @param {*} keypoints 
 * @param {*} canvas 
 * @param {*} ctx 
 */
function drawFingerCount(keypoints, canvas, ctx) {
    const count = countExtendedFingers(keypoints);
    if (count <= 0 || count > 5) {
        return;
    }

    const xRate = canvas.width / video.videoWidth;
    const yRate = canvas.height / video.videoHeight;

    const wrist = keypoints[0];
    const x = wrist.x * xRate;

    // 指の先端のY座標を取得して、最も高い位置に数字を描画
    const tipIndices = [4, 8, 12, 16, 20];
    const tipYValues = tipIndices.map(i => keypoints[i].y * yRate);
    const minY = Math.min(...tipYValues);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 96px Arial';
    ctx.fillText(count.toString(), x, minY - 20);
}


/**
 * 手を検出して描画・カウント
 */
async function detectHands() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const hands = await detector.estimateHands(video, {
        flipHorizontal: false
    });

    hands.forEach(hand => {
        const keypoints = hand.keypoints;
        drawHand(keypoints);

        drawFingerCount(keypoints, canvas, ctx);
    });

    requestAnimationFrame(detectHands);
}

/**
 * 初期化・開始
 */
async function app() {
    await setupCamera();
    await setupModel();

    detectHands();
}

app();