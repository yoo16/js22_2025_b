document.addEventListener("DOMContentLoaded", () => {
    const playBtn = document.getElementById("play");
    const downloadBtn = document.getElementById("downloadBtn");
    const statusEl = document.getElementById("status");
    const loadingModal = document.getElementById("loadingModal");

    /**
     * モーダル表示切替
     */
    const showLoading = (show) => {
        if (show) {
            loadingModal.classList.remove("hidden");
        } else {
            loadingModal.classList.add("hidden");
        }
    };

    playBtn.addEventListener("click", async () => {
        // ブラウザからテキスト取得
        const text = "";
        // ブラウザから model_id 取得
        const model_id = "";
        // voice_id 取得
        const voice_id = "";
        // 音声フォーマット取得
        const format = "";

        if (!text) {
            alert("テキストを入力してください");
            return;
        }

        try {
            statusEl.textContent = "";
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
            const endpoint = ``;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": CONFIG.API_KEY,
                },
                body: JSON.stringify({
                    // TODO: text
                    // TODO: model_id
                    // TODO: voice_settings: { stability, similarity_boost }
                    // TODO: output_format
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error("APIエラー: " + errorText);
            }

            // 音声データをArrayBufferとして取得
            const arrayBuffer = await response.arrayBuffer();
            // mimeタイプ判定
            const mimeType = format.startsWith("mp3") ? "audio/mpeg" :
                format.startsWith("wav") ? "audio/wav" :
                    "audio/pcm";
            const blob = new Blob([arrayBuffer], { type: mimeType });
            const url = URL.createObjectURL(blob);

            // 再生
            const audio = new Audio(url);
            audio.play();
            statusEl.textContent = "再生中...";
            audio.onended = () => {
                statusEl.textContent = "再生終了";
            };

            // TODO: ダウンロードボタン有効化

            // 拡張子判定
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
