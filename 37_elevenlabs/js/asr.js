document.addEventListener("DOMContentLoaded", () => {
    const transcribeBtn = document.getElementById("transcribeBtn");
    const result = document.getElementById("result");
    const audioInput = document.getElementById("audioFile");
    const audioPlayer = document.getElementById("audioPlayer");
    const loadingModal = document.getElementById("loadingModal");
    const languageSelect = document.getElementById("languageSelect");
    const fileNameDisplay = document.getElementById("fileName");

    // ElevenLabs Speech-to-Textモデル
    const model_id = "scribe_v1";

    /**
     * モーダル表示・非表示
     */
    function showLoading(show) {
        if (show) {
            loadingModal.classList.remove("hidden");
        } else {
            loadingModal.classList.add("hidden");
        }
    }

    /**
     * オーディオ再生
     */
    function playAudio() {
        if (audioInput.files.length > 0) {
            // 選択されたファイルを取得
            const file = audioInput.files[0];

            // ファイル名表示
            fileNameDisplay.textContent = file.name;

            // オーディオタグにセット
            const url = URL.createObjectURL(file);
            audioPlayer.src = url;
            audioPlayer.classList.remove("hidden");
            // オーディオの再生
            audioPlayer.play().catch(err => {
                console.warn("自動再生がブロックされました:", err);
            });
        } else {
            // ファイルが選択されていない場合
            fileNameDisplay.textContent = "未選択";
            audioPlayer.src = "";
            audioPlayer.classList.add("hidden");
        }
    }

    /**
     * 音声ファイルをElevenLabs APIに送信して文字起こしを実行
     */
    async function generateAudio() {
        if (!audioInput.files.length) {
            alert("音声ファイルを選択してください");
            return;
        }

        // 選択された言語コード
        const selectedLang = languageSelect.value;
        // オーディオファイル
        const audioFile = audioInput.files[0];
        // 結果表示クリア
        result.textContent = "";

        // フォームデータ作成
        const formData = new FormData();
        // TODO: file に音声ファイルを設定
        // TODO: model_id を設定
        // TODO: language に selectedLang を設定

        try {
            // モーダル表示
            showLoading(true);

            // TODO: APIエンドポイント: https://api.elevenlabs.io/v1/speech-to-text
            const endpoint = "";
            // APIリクエスト
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "xi-api-key": CONFIG.API_KEY
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error("APIエラー: " + errorText);
            }

            // TODO: データ受信
            // TODO: result に文字起こし結果を表示
        } catch (error) {
            console.error(error);
            result.textContent = "エラー: " + error.message;
        } finally {
            // モーダル非表示
            showLoading(false); 
        }
    }

    // ファイル選択イベント
    audioInput.addEventListener("change", playAudio);

    // ASR処理開始
    transcribeBtn.addEventListener("click", generateAudio);
});