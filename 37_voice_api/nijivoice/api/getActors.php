<?php
require_once 'env.php';

header("Content-Type: application/json; charset=utf-8");

$apiUrl = "https://api.nijivoice.com/api/platform/v1/voice-actors";
// 環境変数や.envから読み込むのが安全
$apiKey = API_KEY;

$ch = curl_init($apiUrl);
// OPTION: レスポンスを文字列で取得
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// HTTP ヘッダー: API KEY をセット
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "accept: application/json",
    "x-api-key: $apiKey"
]);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
    exit;
}
curl_close($ch);

echo $response;