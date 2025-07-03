// DOMの取得
const micToggleBtn = document.getElementById('mic-toggle');
const consoleEl = document.getElementById('console');
const wordListEl = document.getElementById('word-list');
const progressBar = document.getElementById('input-level');

const firstMessage = "Please speak into the microphone.";

// AudioMeter 用の変数
let isMuted = false;
// オーディオコンテキスト
let audioContext;
// オーディオ解析用の AnalyserNode
let analyser;
// オーディオメーターのストリーム
let microphoneStream;

// 確率スコアの閾値 
const probabilityThreshold = 0.75;

// 音声認識用の変数
let recognizer;

/**
 * SpeechCommandsRecognizer を使用して音声認識を実行し、認識結果を画面に表示
 * @param {number} [probabilityThreshold] - 確率スコアの閾値
 */
function predictWord(words) {
    try {
        // マイク入力をリアルタイム監視
        recognizer.listen(({ scores }) => {
            // console.log(scores)

            // 各単語の確率スコアを (score, word) ペアに変換
            scores = Array.from(scores).map((s, i) => ({ score: s, word: words[i] }));
            // スコアが高い順に並べ替え
            scores.sort((s1, s2) => s2.score - s1.score);

            // TODO: 単語決定: scores[0].word;
            const recognizedWord = "";
            console.log(recognizedWord);

            // 単語ハイライト
            highlightWord(recognizedWord);
        }, { probabilityThreshold: probabilityThreshold });
    } catch (error) {
        console.log(error);
    }
}

/**
 * コンソール要素にメッセージを表示する
 * @param {string} message 表示するメッセージ
 */
function displayConsole(message) {
    consoleEl.textContent = message;
}

/**
 * 音声認識可能な単語一覧を、カード型のカラム表示
 * @param {Object} words 単語のオブジェクト
 */
function displayWordList(words) {
    if (!words) return;

    // 除外する単語をフィルタリング
    const filteredWords = Object.values(words)
        .filter(word => word !== '_background_noise_' && word !== '_unknown_');

    // グリッドレイアウト用のコンテナを作成（例：4カラム）
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid grid-cols-4 gap-2 mt-2';

    // 各単語をカードとして作成
    filteredWords.forEach(word => {
        const card = document.createElement('div');
        card.textContent = word;
        card.className = 'p-4 bg-white rounded shadow text-center';
        gridContainer.appendChild(card);
    });

    // 表示領域にグリッドコンテナを追加
    wordListEl.appendChild(gridContainer);
}

/**
 * 認識した単語に対応するカードをハイライトする
 * @param {string} word 認識された単語
 */
function highlightWord(word) {
    // gridContainer 内の全カード（div 要素）を取得
    const cards = wordListEl.querySelectorAll('div.grid > div');
    cards.forEach(card => {
        if (card.textContent === word) {
            card.classList.add('bg-yellow-300'); // ハイライト
        } else {
            card.classList.remove('bg-yellow-300'); // ハイライト解除
        }
    });
}

/**
 * マイク入力レベルを表示するために Web Audio API を利用
 */
async function initAudioMeter() {
    try {
        // TODO: 音声付きメディアストリーム取得: audio : true
        let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!stream) return;

        // オーディオコンテキストの作成
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // MediaStream からオーディオソースノードを生成
        const source = audioContext.createMediaStreamSource(stream);

        // AnalyserNode を作成して FFT サイズを設定
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        // オーディオソースを AnalyserNode に接続
        source.connect(analyser);
        // ストリームオブジェクトを保持
        microphoneStream = stream;

        // 音声入力レベルのアップデート処理を開始
        updateInputLevel();
    } catch (error) {
        displayConsole('音声取得できません。');
    }
}

/**
 * 入力レベルを測定し progress 要素を更新する
 */
function updateInputLevel() {
    if (!analyser) return;
    // 解析の周波数ビン（データポイント）から配列(Uint8Array)を作成
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(dataArray);

    // ノーマライズの2乗和計算
    let sumSquares = 0;
    for (let i = 0; i < dataArray.length; i++) {
        const normalized = (dataArray[i] / 128) - 1;
        sumSquares += normalized * normalized;
    }
    // RMS値
    const rms = Math.sqrt(sumSquares / dataArray.length);
    // rms を 0-100 のスケールに変換（調整が必要な場合は multiplier を変更）
    const level = Math.min(100, rms * 100 * 2);

    // TODO: プログレスバー更新
    progressBar.value = 0;

    // フレーム更新
    requestAnimationFrame(updateInputLevel);
}

/**
 * ミュートボタンのトグル処理
 */
micToggleBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
        // ミュート listen を停止
        micToggleBtn.textContent = 'Mic Mute';
        micToggleBtn.classList.add('bg-gray-500');
        recognizer.stopListening();
        displayConsole('Mic muted');
    } else {
        // ミュート解除時は再度 listen を開始
        predictWord();
        micToggleBtn.textContent = 'Mic On';
        micToggleBtn.classList.remove('bg-gray-500');
        displayConsole(firstMessage);
    }
});

/**
 * SpeechCommandsRecognizer を初期化し、音声認識を開始する
 * @returns {Promise<void>}
 */
async function app() {
    // オーディオメーター
    initAudioMeter();

    // SpeechCommands の作成（BROWSER_FFT はブラウザ内の FFT アルゴリズムを利用）
    recognizer = speechCommands.create('BROWSER_FFT');
    // モデルの読み込みまで待機
    await recognizer.ensureModelLoaded();

    // TODO: 単語ラベル取得: recognizer.wordLabels()
    const words = {};
    console.log(words);
    // 単語ラベル表示
    displayWordList(words);

    // 音声認識処理
    predictWord(words);
}

// メインアプリ実行
app();