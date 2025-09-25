// IDが"play"のボタンがクリックされたときの処理
document.getElementById("play").addEventListener("click", async () => {
    const text = "こんにちは！"; // 生成したい音声テキスト
    const status = document.getElementById("status");
    status.textContent = "⏳ 音声生成中...";

    try {
        // TODO: APIエンドポイントとリクエスト内容を確認・修正
        // - URI: https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
        // - Method: POST
        // - Headers: "xi-api-key" にAPIキーを設定
        // - Body: JSON形式で"text"と"model_id"を含む

        // 例: voice_id を指定
        const voice_id = "EXAVITQu4vr4xnSDxMaL"; 
        const model_id = "eleven_multilingual_v2";
         // TODO: エンドポイントURLを設定
        const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`;
        // Fetch APIを使ってPOSTリクエストを送信
        const response = await fetch(
            endpoint,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": CONFIG.API_KEY, // TODO: APIキーを設定
                },
                body: JSON.stringify({
                    text: text,
                    // TODO: ここに model_id を設定
                    model_id: model_id,
                }),
            }
        );
        // レスポンスのステータ 200番台以外はエラーとして扱う
        if (!response.ok) {
            throw new Error(`APIエラー: ${response.status}`);
        }

        // TODO: レスポンスの形式を確認し、音声データの取得方法を修正: arrayBuffer()
        const audioData = await response.arrayBuffer();
        // TODO: 音声データのMIMEタイプを確認し、適切に設定: Blob で type: "audio/mpeg"
        const blob = new Blob([audioData], { type: "audio/mpeg" });
        // URL.createObjectURL() の引数を blob に修正
        const url = URL.createObjectURL(blob);
        // TODO: url から Audioオブジェクトの作成
        const audio = new Audio(url);
        // TODO: オーディオの再生
        audio.play();

        status.textContent = "✅ 再生中...";
    } catch (err) {
        console.error(err);
        status.textContent = "❌ エラーが発生しました。";
    }
});
