// HTMLの要素が読み込まれた後にスクリプトを実行
document.addEventListener("DOMContentLoaded", () => {
    // HTML要素の取得
    const playBtn = document.getElementById("play");
    const downloadBtn = document.getElementById("downloadBtn");
    const statusEl = document.getElementById("status");
    const loadingModal = document.getElementById("loadingModal");

    /**
     * モーダル表示切替
     */
    const showLoading = (show) => {
        if (show) {
            // ローディング表示
            loadingModal.classList.remove("hidden");
        } else {
            // ローディング非表示
            loadingModal.classList.add("hidden");
        }
    };

    // playボタンがクリックされたときの処理（非同期関数）
    playBtn.addEventListener("click", async () => {
        // TODO: ブラウザからテキスト取得 id="textInput"
        const text = document.getElementById("textInput").value.trim();
        // TODO: ブラウザから model_id 取得 id="modelSelect"
        const model_id = document.getElementById("modelSelect").value;
        // TODO: voice_id 取得
        const voice_id = document.getElementById("voiceSelect").value;
        // TODO: 音声フォーマット取得
        const format = document.getElementById("formatSelect").value;
        // コンソールで確認
        console.log(text, model_id, voice_id, format);

        if (!text) {
            alert("テキストを入力してください");
            return;
        }

        try {
            statusEl.textContent = "";
            // プレイボタンを無効化
            playBtn.disabled = true;
            downloadBtn.classList.add("opacity-50", "pointer-events-none");

            // モーダル表示
            showLoading(true);

            // TODO: APIエンドポイントとリクエスト内容を確認・修正
            // - URI: https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream
            // - Method: POST
            // - Headers: "xi-api-key" にAPIキーを設定
            // - Body: JSON形式で"text", "model_id", "voice_settings", "output_format"を含む

            // TODO: エンドポイントURLを設定
            const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}/stream`;
            // Fetch APIを使ってPOSTリクエストを送信
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": CONFIG.API_KEY,
                },
                body: JSON.stringify({
                    // TODO: text
                    text: text,
                    // TODO: model_id
                    model_id: model_id,
                    // TODO: voice_settings: { stability, similarity_boost }
                    voice_settings: { stability: 0.5, similarity_boost: 0.75 },
                    // TODO: output_format
                    format: format,
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error("APIエラー: " + errorText);
            }

            // 音声データをArrayBufferとして取得
            const arrayBuffer = await response.arrayBuffer();
            // mimeタイプ判定
            // もし mp3 で始まるなら audio/mpeg
            // もし wav で始まるなら audio/wav
            // それ以外は audio/pcm とする
            const mimeType = format.startsWith("mp3") ? "audio/mpeg" :
                format.startsWith("wav") ? "audio/wav" :
                    "audio/pcm";
            const blob = new Blob([arrayBuffer], { type: mimeType });
            const url = URL.createObjectURL(blob);

            // 再生
            const audio = new Audio(url);
            audio.play();
            statusEl.textContent = "再生中...";
            // オーディオ再生が終了したら status を更新
            audio.onended = () => {
                statusEl.textContent = "再生終了";
            };

            // TODO: ダウンロードボタン有効化
            downloadBtn.href = url;

            // 拡張子判定
            // mimeType に "mpeg" が含まれるなら "mp3"
            // mimeType に "wav" が含まれるなら "wav"
            // それ以外は "pcm"
            const extension = mimeType.includes("mpeg")
                ? "mp3"
                : mimeType.includes("wav")
                    ? "wav"
                    : "pcm";

            // ダウンロードファイル名を設定
            downloadBtn.download = `generated_audio.${extension}`;
            downloadBtn.classList.remove("opacity-50", "pointer-events-none");

        } catch (error) {
            console.error(error);
            statusEl.textContent = "エラー: " + error.message;
        } finally {
            // モーダル非表示
            showLoading(false);
            playBtn.disabled = false;
        }
    });
});
