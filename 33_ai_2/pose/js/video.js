const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const statusElement = document.getElementById('status');
const fileInput = document.getElementById('fileInput');

const ctx = canvas.getContext('2d');

statusElement.textContent = 'モデル読み込み中...';
fileInput.disabled = true;

// 検出器の初期化
let detector;
 // モデル読み込み状態
let modelReady = false;

async function loadModel() {
    // TensorFlow.jsのバックエンドをWebGLに設定
    await tf.setBackend('webgl');
    // TensorFlow.jsの準備
    await tf.ready();

    detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        }
    );

    modelReady = true;
    console.log("モデル読み込み完了");
}

/**
 * キーポイントを描画
 * @param {*} keypoints 
 */
function drawKeypoints(keypoints) {
    for (const keypoint of keypoints) {
        // TODO: キーポイントのスコアが0.4以上なら描画
        if (keypoint.score > 1.0) {
            ctx.beginPath();
            ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
        }
    }
}

/**
 * 描画ループ
 * @returns 
 */
async function render() {
    // 動画が再生中でない場合は再帰的に呼び出し
    if (video.paused || video.ended) {
        requestAnimationFrame(render);
        return;
    }
    // キャンバスをクリア
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // 骨格検出
    const poses = await detector.estimatePoses(video);
    // 骨格のキーポイントを描画
    for (const pose of poses) {
        drawKeypoints(pose.keypoints);
    }
    // キーフレームの描画
    requestAnimationFrame(render);
}

// ユーザーが動画ファイルを選択したときの処理
document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        video.src = url;

        // モデルが読み込まれてから再生
        const waitForModel = async () => {
            while (!modelReady) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // 動画読み込み後、サイズをキャンバスに反映
            video.addEventListener('loadeddata', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                video.play();
            });
            video.load();
        };
        waitForModel();
    }
});

/**
 * メイン関数
 */
async function main() {
    // モデルの読み込み
    await loadModel();

    // UIの更新
    statusElement.textContent = 'モデル読み込み完了！動画を選択してください';
    fileInput.disabled = false;

    // Video再生後に描画を開始
    video.addEventListener('play', () => {
        render();
    });
}

main();
