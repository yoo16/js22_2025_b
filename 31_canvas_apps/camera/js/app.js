// DOM 要素
const video = document.getElementById('video');
const captureBtn = document.getElementById('capture-btn');
const photoInput = document.getElementById('photo');
const canvasArea = document.getElementById('canvas-area');
const countdownOverlay = document.getElementById('countdownOverlay');
const countdownCircle = document.getElementById('countdownCircle');
const loadingModal = document.getElementById('loadingModal');
const toggleAudioBtn = document.getElementById('toggleAudioBtn');
const imageModal = document.getElementById('imageModal');
const capturedImage = document.getElementById('capturedImage');
const closeImageModal = document.getElementById('closeImageModal');
const downloadImageBtn = document.getElementById('downloadImage');
const frameThumbnails = document.querySelectorAll('.frame-thumbnail');

// 合成用の Canvas を作成
const compositeCanvas = document.createElement('canvas');
const compositeCtx = compositeCanvas.getContext('2d');

// ビデオ要素の初期設定

// 現在選択中のフレーム画像（初期は最初のサムネイル）
let currentFrameSrc = document.querySelector('.frame-thumbnail').dataset.frame;

// キャンバスサイズ
const canvasWidth = 640;
const canvasHeight = 480;

// シャッタータイマーの遅延時間（秒）
const shutterDelaySeconds = 3;

// キャプチャされた画像を保持するための DataTransfer オブジェクト
const dataTransfer = new DataTransfer();

// カウントダウンのオーディオを読み込む
const countdownAudio = new Audio('audio/countdown.wav');

// 音声再生のON/OFF制御フラグ（初期値：ON）
let audioEnabled = true;

// TODO: 合成用フレーム画像オブジェクト
const overlayFrame = new Image();
overlayFrame.src = currentFrameSrc;

/**
 * 合成用の Canvas を作成し、DOM へ追加
 *
 * @description
 *   合成用の Canvas を作成し、DOM へ追加する。
 *   この Canvas には、合成された画像が描画される。
 */
function createCompositeCanvas() {
    compositeCanvas.width = canvasWidth;
    compositeCanvas.height = canvasHeight;
    // 合成用のフレーム画像を設定
    canvasArea.appendChild(compositeCanvas);
}

/**
 * カメラの有効化
 */
const onCamera = async () => {
    // TODO: カメラの有効化処理を実装
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
};

/**
 * 画像キャプチャ処理
 * compositeCanvas の内容（ビデオとフレームの合成済み）をキャプチャして Blob 化
 */
const onCapture = async () => {
    // 画像ファイル名
    const imageFileName = `captured-image-${Date.now()}.jpg`;
    // 画像の MIME タイプ
    const imageType = 'image/jpeg';
    // モーダルを表示
    loadingModal.classList.remove('hidden');
    // canvas の内容を Blob に変換
    compositeCanvas.toBlob((blob) => {
        // 画像ファイルを DataTransfer に追加
        const file = new File([blob], imageFileName, { type: imageType });
        // データ転送オブジェクトにファイルを追加
        dataTransfer.items.add(file);
        // 画像入力要素にファイルを設定
        photoInput.files = dataTransfer.files;
        // 画像URL を生成
        const imageUrl = URL.createObjectURL(blob);
        // 画像モーダルに表示
        capturedImage.src = imageUrl;
        imageModal.classList.remove('hidden');
        loadingModal.classList.add('hidden');
    }, imageType);
};

/**
 * カウントダウン処理
 */
const countDown = () => {
    let count = shutterDelaySeconds;
    countdownCircle.textContent = count;
    countdownOverlay.classList.remove('hidden');
    countdownCircle.classList.add('animate-ping');

    // setInterval を使用してカウントダウンを開始
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            // カウントダウン中
            countdownCircle.textContent = count;
        } else {
            // カウントダウン終了
            clearInterval(countdownInterval);
            countdownOverlay.classList.add('hidden');
            countdownCircle.classList.remove('animate-ping');
            // 画像キャプチャを実行
            onCapture();
            captureBtn.disabled = false;
        }
    }, 1000);
};

/**
 * Countdown Audio の再生
 */
const playSound = () => {
    countdownAudio.currentTime = 0;
    countdownAudio.play();
};

// キャプチャボタン押下時
captureBtn.addEventListener('click', () => {
    captureBtn.disabled = true;
    if (audioEnabled) playSound();
    countDown();
});


// サムネイルクリック時のイベントを設定
frameThumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
        // TODO: クリックされたサムネイルからフレーム画像のパスを取得
        currentFrameSrc = thumb.dataset.frame;
        overlayFrame.src = currentFrameSrc;

        // 選択中のサムネイルにスタイルを適用
        frameThumbnails.forEach(t => t.classList.remove('border-blue-500'));
        thumb.classList.add('border-blue-500');
    });
});

// ビデオが再生開始されたら、Canvas に合成描画を開始
video.addEventListener('play', () => {
    const drawComposite = () => {
        if (video.paused || video.ended) return;
        // ビデオの現在のフレームを描画
        compositeCtx.drawImage(video, 0, 0, canvasWidth, canvasHeight);
        // フレーム画像が読み込まれている場合、合成
        if (overlayFrame.complete) {
            compositeCtx.drawImage(overlayFrame, 0, 0, canvasWidth, canvasHeight);
        }
        requestAnimationFrame(drawComposite);
    };
    drawComposite();
});


// 画像モーダルの「Close」ボタン
closeImageModal.addEventListener('click', () => {
    imageModal.classList.add('hidden');
});

// ダウンロードボタンのイベント
downloadImageBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = capturedImage.src;
    link.download = `captured-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Audio ON/OFF 切替
toggleAudioBtn.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    toggleAudioBtn.textContent = audioEnabled ? "Audio ON" : "Audio OFF";
});

// カメラ有効化
onCamera();
// 合成用の Canvas を作成
createCompositeCanvas();
