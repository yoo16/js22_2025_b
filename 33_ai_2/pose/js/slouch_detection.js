const messageDisplay = document.getElementById('message-display');
const video = document.getElementById('webcam');
const canvas = document.getElementById('outputCanvas');

const ctx = canvas.getContext('2d');

// 検出器の初期化
let detector;
// フレームカウント
let frameCount = 0;
// 姿勢が悪いと判断された時間
let badPostureStart = null;
// 音声ファイルのパス
let audioFile = "audio/voice_2_badpose.mp3"
// 音声再生中かどうかのフラグ
let isAudioPlaying = false;
// 最後に音声を再生した時間
let lastAudioPlayTime = 0;
let faceResults = [];
// 姿勢が悪いと判断する閾値（10秒）
const BAD_POSTURE_THRESHOLD = 10 * 1000;
// 音声再生間隔（10秒）
const AUDIO_INTERVAL = 10 * 1000;
// 音声の初期状態
let isAudioEnabled = true; // 初期状態：音声ON
// 音声ファイルの読み込み
const sleepyAudio = new Audio(audioFile);

// 骨格接続定義
const keypointPairs = [
    [5, 6],             // shoulders
    [5, 7], [7, 9],     // left arm
    [6, 8], [8, 10],    // right arm
    [5, 11], [6, 12],   // shoulders → hips
    [11, 12],           // hips
    [11, 13], [13, 15], // left leg
    [12, 14], [14, 16]  // right leg
];

// 顔に対応するインデックス: nose(0), eyes(1,2), ears(3,4)
const faceIndices = [0, 1, 2, 3, 4];

/**
 * 音声ファイル読み込み完了時の処理
 * - 再生中でなければ再生
 */
sleepyAudio.onended = () => {
    isAudioPlaying = false;
};

/**
 * 音声ボタンのラベルを更新
 */
function updateAudioButtonLabel() {
    const btn = document.getElementById("toggle-audio");
    btn.textContent = isAudioEnabled ? "🔊 音声ON" : "🔇 音声OFF";
}

/**
 * カメラをセットアップ
 * - カメラのストリームを取得し、ビデオ要素に設定
 */
async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
    video.srcObject = stream;
    await video.play();
}

/**
 * Pose Detection モデルをセットアップ
 */
async function setupModel() {
    const model = poseDetection.SupportedModels.MoveNet;
    detector = await poseDetection.createDetector(model, {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    });
    messageDisplay.textContent = 'Pose Detection モデルがロードされました。';
}

/**
 * キーポイントを描画 
 * @param {*} keypoints 
 */
function drawKeypoints(keypoints) {

    faceIndices.forEach(index => {
        const point = keypoints[index];
        // 信頼度が0.5以上のポイントのみ描画
        if (point.score > 0.5) {
            const x = point.x * canvas.width / video.videoWidth;
            const y = point.y * canvas.height / video.videoHeight;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
        }
    });
}

/**
 * 骨格を描画
 * @param {Array} keypoints - 検出されたキーポイントの配列
 */
function drawSkeleton(keypoints) {
    keypointPairs.forEach(([start, end]) => {
        const p1 = keypoints[start];
        const p2 = keypoints[end];
        if (p1.score > 0.3 && p2.score > 0.3) {
            const x1 = p1.x * canvas.width / video.videoWidth;
            const y1 = p1.y * canvas.height / video.videoHeight;
            const x2 = p2.x * canvas.width / video.videoWidth;
            const y2 = p2.y * canvas.height / video.videoHeight;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    });
}

/**
 * 姿勢結果を表示 
 * @param {*} isHeadDroping 
 */
function updateMessage(text, bgClass, textClass) {
    messageDisplay.textContent = text;

    // すべての背景・テキストカラークラスをリセット
    messageDisplay.classList.remove(
        'bg-red-300', 'bg-red-500', 'bg-orange-300',
        'text-red-800', 'text-white', 'text-orange-800'
    );

    if (bgClass) messageDisplay.classList.add(bgClass);
    if (textClass) messageDisplay.classList.add(textClass);
}

/**
 * 音声再生
 * @param {*} now 
 */
function playAudio(now) {
    if (isAudioEnabled && !isAudioPlaying && now - lastAudioPlayTime > AUDIO_INTERVAL) {
        sleepyAudio.play();
        isAudioPlaying = true;
        lastAudioPlayTime = now;
    }
}

/**
 * 音声停止
 */
function stopAudio() {
    if (isAudioPlaying) {
        sleepyAudio.pause();
        sleepyAudio.currentTime = 0;
        isAudioPlaying = false;
    }
}

/**
 * 姿勢結果を表示
 * - 悪い姿勢と判断された場合は音声を再生
 * - 前傾角度が10秒以上続いた場合は悪い姿勢
 * @param {*} isHeadDropping 
 */
function showPostureResult(isHeadDropping) {
    // 前傾角度検出で悪い姿勢と判断された場合
    if (isHeadDropping) {
        // 現在の時刻取得
        const now = Date.now();
        // 開始時間を更新
        if (!badPostureStart) badPostureStart = now;
        // TODO: 10秒以上続いている場合は悪い姿勢と判断
        const isBadPosture = false;
        if (isBadPosture) {
            updateMessage('姿勢わるくない？', 'bg-red-500', 'text-white');
            // TODO: 音声再生
        } else {
            updateMessage('うつむき', 'bg-orange-300', 'text-orange-800');
        }
    } else {
        badPostureStart = null;
        updateMessage('OK!', 'bg-green-300', 'text-green-800');
        stopAudio();
    }
}

/**
 * 前傾角度を計算
 * @param {*} keypoints 
 * @returns 
 */
function isHeadDroping(keypoints) {
    const leftEye = keypoints[1];
    const rightEye = keypoints[2];
    const leftEar = keypoints[3];
    const rightEar = keypoints[4];

    // TODO: 目と耳の位置(Y)を比較して、うつむきかどうかを判定
    const leftDrop = false;
    const rightDrop = false;

    // TODO: 目の方が下ならうつむきと判定
    return false;
}

/**
 * 姿勢を検出し、描画
 */
async function detectPose() {
    // キャンバスクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ポーズ検出
    const poses = await detector.estimatePoses(video);
    if (poses.length > 0) {
        const keypoints = poses[0].keypoints;
        // キーポイントの描画
        drawKeypoints(keypoints);
        // 骨格の描画
        drawSkeleton(keypoints);
        // ポーズの結果表示
        const headDroping = isHeadDroping(keypoints);
        showPostureResult(headDroping)
    }
    // フレーム更新
    requestAnimationFrame(detectPose);
}

// ボタンイベントリスナーを設定
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggle-audio");
    toggleBtn.addEventListener("click", () => {
        isAudioEnabled = !isAudioEnabled;
        updateAudioButtonLabel();
    });
    updateAudioButtonLabel();
});

/**
 * メインアプリケーションの初期化
 */
async function app() {
    await setupCamera();
    await setupModel();
    detectPose();
}

app();