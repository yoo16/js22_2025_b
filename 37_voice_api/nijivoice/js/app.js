// 声優一覧
let actorsData = [];
// メッセージ
let message = '';
// 音声フォーマット
const format = 'mp3';
// ローディング表示インデックス
let currentIndex = 0;
// ローーィング状態
let isLoading = false;
// 読み込み要素の件数
let BATCH_SIZE = getBatchSize();
// スクロール監視セットアップ
let observer = setupInfiniteScroll(renderNextActors);
// speed, emotion の初期値(string)
let speed = '1.0';
let emotion = '0.1';

// メイン表示部分の要素を取得
const messageContainer = document.getElementById('message');
const actorListContainer = document.getElementById('actorList');
const actorCard = document.getElementById('actor');
const actorImg = document.getElementById('actor-image');
const actorName = document.getElementById('actor-name');
const actorMessage = document.getElementById('actor-message');
const actorAudio = document.getElementById('actor-audio');
const createAudioButton = document.getElementById('create-audio-btn');
const audioContainer = document.getElementById('audio-container');
const downloadBtn = document.getElementById('download-btn');

// スライダーのラベルをリアルタイム更新
const speedSlider = document.getElementById('voice-speed');
const speedValue = document.getElementById('voice-speed-value');
const emotionSlider = document.getElementById('voice-emotion');
const emotionValue = document.getElementById('voice-emotion-value');

// ローディング
const loadingIndicator = document.getElementById('loading-indicator');
const imageLoading = document.getElementById('image-loading');
const voiceLoading = document.getElementById('voice-loading');

/**
 * getBatchSize()
 * 
 * 画面幅に応じた読み込み件数を返す
 * @returns {number} BATCH_SIZE - 画面幅に応じた読み込み件数
 */
function getBatchSize() {
    const width = window.innerWidth;
    if (width >= 1024) return 12;   // lg (デスクトップ)
    if (width >= 768) return 9;     // md (タブレット)
    return 6;                       // sm (スマホ)
}

/**
 * ローディング表示切り替え
 * @param {HTMLElement} el - ローディング対象のDOM要素
 * @param {boolean} show - true: 表示 / false: 非表示
 */
function toggleLoading(el, show) {
    if (!el) return;
    if (show) {
        el.classList.remove('hidden');
    } else {
        el.classList.add('hidden');
    }
}

/**
 * 音声生成のUIを切り替える
 * @param {boolean} isLoading - true: ローディング中 / false: 完了
 */
function toggleVoiceLoading(isLoading) {
    if (isLoading) {
        toggleLoading(voiceLoading, true);
        toggleLoading(audioContainer, false);
    } else {
        toggleLoading(voiceLoading, false);
        toggleLoading(audioContainer, true);
    }
}

// JS から にじボイスAPI のアクセスが正常に動く人用
/**
 * getActors()
 * 
 * 声優一覧APIをGET取得
 * URI: https://api.nijivoice.com/api/platform/v1/voice-actors
 */
async function getActors() {
    try {
        // TODO: オプション設定
        // メソッド: GET
        // ヘッダー: accept: application/json
        // x-api-key: API_KEY 
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-api-key': API_KEY
            }
        };

        // TODO: 声優一覧APIのURL
        const uri = 'https://api.nijivoice.com/api/platform/v1/voice-actors';
        // Fetch API で取得
        const response = await fetch(uri, options);
        // オブジェクトに変換
        const data = await response.json();
        console.log("取得:", data);
        // 声優一覧をグローバル変数にセット
        actorsData = data.voiceActors || [];
        return actorsData;
    } catch (err) {
        console.error(err);
        messageContainer.textContent = '声優一覧の取得に失敗しました。';
    }
}

// サーバ証明書で動かない人！
// Apache + PHP でプロキシ経由で取得
/**
 * getActors()
 * 
 * Apache + PHP でプロキシ経由で取得
 * URI: ./api/getActors.php
 */
// async function getActors() {
//     try {
//         const response = await fetch('./api/getActors.php');
//         const data = await response.json();
//         actorsData = data.voiceActors || [];
//         return actorsData;
//     } catch (err) {
//         console.error(err);
//         messageContainer.textContent = '声優一覧の取得に失敗しました。';
//     }
// }


// JS から にじボイスAPI のアクセスが正常の動く人用
/**
 * getVoice()
 * 
 * 音声生成APIをPOSTして音声生成&取得
 * URI: https://api.nijivoice.com/api/platform/v1/voice-actors/{id}/generate-voice
 * 
 * @param {*} id 
 * @param {*} message 
 * @returns 
 */
async function getVoice(id, message) {
    if (!message.trim()) return;

    try {
        // speed, emotion の値を取得
        speed = document.getElementById('voice-speed')?.value || '1.0';
        emotion = document.getElementById('voice-emotion')?.value || '0.1';

        // TODO: POST送信パラメータ
        // format: mp3
        // speed: スライダーの値
        // emotionalLevel: スライダーの値
        // soundDuration: 0.1 固定（string）
        // script: 引数の message
        const params = {
        };

        // TODO: オプション設定
        // メソッド: POST
        // ヘッダー: accept: application/json
        //          content-type: application/json
        // x-api-key: API_KEY 
        // body: JSON.stringify(データ)
        const options = {
        };

        // TODO: 音声生成APIのURL: {id} は引数の id に置換
        const uri = ``;
        // Fetch API で取得
        const response = await fetch(uri, options);
        // オブジェクトに変換
        const data = await response.json();
        console.log("音声生成結果:", data);
        return data;
    } catch (err) {
        console.error("音声生成エラー: ", err);
    }
}

// サーバ証明書で動かない人！
/**
 * getVoice()
 * 
 * Apache + PHP でプロキシ経由で取得
 */
// async function getVoice(id, message) {
//     if (!message.trim()) return;

//     try {
//         // speed, emotion の値を取得
//         speed = document.getElementById('voice-speed')?.value || '1.0';
//         emotion = document.getElementById('voice-emotion')?.value || '0.1';

//         // フォームデータを作成
//         const formData = new FormData();
//         formData.append("id", id);
//         formData.append("message", message);
//         formData.append("speed", speed);
//         formData.append("emotion", emotion);

//         // PHP (generateVoice.php) にPOST
//         const response = await fetch("./api/generateVoice.php", {
//             method: "POST",
//             body: formData
//         });

//         const data = await response.json();
//         console.log("音声生成結果:", data);
//         return data;
//     } catch (err) {
//         console.error("音声生成エラー: ", err);
//         messageContainer.textContent = "音声生成に失敗しました。";
//     }
// }

/**
 * getBalance()
 * 
 * 残高情報APIを取得
 * URI: https://api.nijivoice.com/api/platform/v1/balances
 */
async function getBalance() {
    try {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-api-key': API_KEY
            }
        };

        // TODO: 残高情報APIのリクエスト
        // const uri = 'https://api.nijivoice.com/api/platform/v1/balances';
        // const response = await fetch(uri, options);
        // const data = await response.json();
        // console.log(data)

        // TODO: 残高を返す: data.balances.remainingBalance
        return 0;
    } catch (err) {
        console.error("残高取得エラー: ", err);
    }
}

// サーバ証明書で動かない人！
/**
 * getBalance()
 * 
 * Apache + PHP でプロキシ経由で取得
 */
// async function getBalance() {
//     try {
//         // balance.php にリクエスト
//         const response = await fetch("./api/balance.php");
//         if (!response.ok) {
//             throw new Error("残高APIリクエスト失敗");
//         }

//         const data = await response.json();
//         console.log("残高API結果:", data);

//         // data.balances.remainingBalance があれば返す
//         return data?.balances?.remainingBalance ?? 0;

//     } catch (err) {
//         console.error("残高取得エラー: ", err);
//         messageContainer.textContent = "残高の取得に失敗しました。";
//         return 0;
//     }
// }

/**
 * selectActor()
 * 
 * 声優一覧の「選択」ボタンをクリックした際に、メインの表示部分を更新する
 * @param {string} id - 選択した声優のID
 */
function selectActor(id) {
    // 保持しているデータから対象の声優を探す
    const actor = actorsData.find(actor => actor.id === id);
    if (!actor) return;

    // 更新前に画像ローディング表示
    toggleLoading(imageLoading, true);

    // TODO: 要素の内容を更新
    // src: actor.smallImageUrl
    // alt: actor.name
    // textContent: actor.name
    // placeholder: actor.sampleScript || '台本を入力してください'
    actorImg.src = actor.smallImageUrl;
    actorImg.alt = actor.name;
    actorName.textContent = actor.name;
    actorMessage.placeholder = 'セリフを入力してください';

    // TODO: 初期音声はサンプル音声URLがあれば更新（なければそのまま）
    // src: actor.sampleVoiceUrl || ''
    actorAudio.src = actor.sampleVoiceUrl;

    // TODO: 画像の読み込み完了時にローディングを非表示
    actorImg.onload = () => {
        toggleLoading(imageLoading, false);
        actorImg.classList.remove('invisible');
    };

    // 「音声作成＆再生」ボタンのクリックイベントを更新
    createAudioButton.onclick = () => {
        if (confirm('音声を生成しますか？\n生成にはクレジットが消費されます。')) {
            // 生成中のUIに切り替え
            toggleVoiceLoading(true);
            // 音声生成APIを呼び出し
            createVoice(actor.id, actorMessage.value);
        }
    };

    // メインの Actor 表示部分にスムーススクロール
    actorCard.scrollIntoView({ behavior: 'smooth' });
}

/**
 * displayBlance()
 * 
 * クレジット残高
 * @param {*} remainingBalance 
 */
function displayBlance(remainingBalance) {
    const balanceContainer = document.getElementById('balance');
    balanceContainer.textContent = `残高: ${remainingBalance}`;
}

/**
 * createVoice()
 * 
 * 指定した声優の音声生成
 * mp3 を再生・ダウンロード
 * 
 * @param {string} id - 声優のID
 * @param {string} message - 台本（メッセージ）
 */
async function createVoice(id, text) {
    if (!text.trim()) return;

    const data = await getVoice(id, text);
    // レスポンスから生成されたオブジェクトを取得
    const { generatedVoice } = data;
    if (generatedVoice && generatedVoice.audioFileUrl && generatedVoice.audioFileDownloadUrl) {
        // TODO: audio タグに src をセット: generatedVoice.audioFileUrl
        actorAudio.src = generatedVoice.audioFileUrl;
        // TODO: ダウンロードリンクに href をセット: generatedVoice.audioFileDownloadUrl
        downloadBtn.href = generatedVoice.audioFileDownloadUrl;

        // 生成後の残クレジット数で残高表示を更新（もし取得できれば）
        if (typeof generatedVoice.remainingCredits === 'number') {
            displayBlance(generatedVoice.remainingCredits);
        }

        // 生成完了のUIに切り替え
        toggleVoiceLoading(false);
    }
}

/**
 * 一定件数だけ描画
 */
function renderNextActors() {
    if (isLoading) return;
    if (currentIndex >= actorsData.length) return;

    isLoading = true;
    toggleLoading(loadingIndicator, true);

    setTimeout(() => {
        const nextBatch = actorsData.slice(currentIndex, currentIndex + BATCH_SIZE);

        const html = nextBatch.map(actor => {
            return `
            <div class="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                <img src="${actor.smallImageUrl}" alt="${actor.name}" class="w-full h-96 object-cover object-top">
                <div class="p-4 flex flex-col flex-grow">
                    <h2 class="text-xl font-semibold mb-2">${actor.name}</h2>
                    <p class="text-gray-700 mb-4 flex-grow">${actor.sampleScript || ''}</p>
                    <p class="text-sm text-gray-500">
                        年齢: ${actor.age} / 性別: ${actor.gender}
                    </p>
                    <button class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" 
                        onclick="selectActor('${actor.id}')">選択</button>
                </div>
            </div>
            `;
        }).join('');

        // html を追加
        actorListContainer.insertAdjacentHTML('beforeend', html);

        // 声優一覧インデックスを更新
        currentIndex += nextBatch.length;
        isLoading = false;
        toggleLoading(loadingIndicator, false);

        // 全件表示完了したら Observer を停止
        if (currentIndex >= actorsData.length) {
            if (observer) observer.disconnect();
            console.log("全件表示完了");
        }
    }, 500);
}

/**
 * 無限スクロールをセットアップ
 * @param {Function} callback - 監視対象が画面に入ったときに呼ぶ処理
 * @param {Object} options - IntersectionObserver のオプション
 * @returns {IntersectionObserver} - observer インスタンス
 */
function setupInfiniteScroll(callback, options = { rootMargin: "200px" }) {
    // Sentinel 要素を作成して body の末尾に追加
    const sentinel = document.createElement('div');
    sentinel.id = "sentinel";
    document.body.appendChild(sentinel);

    // TODO: 無限スクロール用のオブザーバーを作成
    // const observer = new IntersectionObserver((entries) => {
    //     if (entries[0].isIntersecting) {
    //         callback();
    //     }
    // }, options);

    // observer.observe(sentinel);
    // return observer;
}

// 初期ロード
(async () => {
    const allActors = await getActors();
    if (allActors?.length) {
        // 最初のバッチを描画
        renderNextActors();
        // 最初の声優を選択状態に
        selectActor(allActors[0].id);
    }

    const remainingBalance = await getBalance();
    displayBlance(remainingBalance);
})();

// イベント
speedSlider.addEventListener('input', () => {
    // TODO: ラベルをリアルタイム更新
});

emotionSlider.addEventListener('input', () => {
    // TODO: ラベルをリアルタイム更新
});

// 画面リサイズ時に BATCH_SIZE を更新
window.addEventListener("resize", () => {
    BATCH_SIZE = getBatchSize();
});