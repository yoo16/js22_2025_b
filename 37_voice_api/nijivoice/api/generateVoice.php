<?php
require_once 'env.php';

header("Content-Type: application/json; charset=utf-8");

$id = $_POST["id"] ?? "";
$message = $_POST["message"] ?? "";
$speed = $_POST["speed"] ?? "1.0";
$emotion = $_POST["emotion"] ?? "0.1";

$apiUrl = "https://api.nijivoice.com/api/platform/v1/voice-actors/$id/generate-voice";
$apiKey = API_KEY;

// にじボイスAPI の仕様に合わせてペイロードを作成
$payload = json_encode([
    "format" => "mp3",
    "speed" => $speed,
    "emotionalLevel" => $emotion,
    "soundDuration" => "0.1",
    "script" => $message
]);

$ch = curl_init($apiUrl);
// OPTION: レスポンスを文字列で取得
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// POST リクエスト
curl_setopt($ch, CURLOPT_POST, true);
// POST データ
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
// HTTP ヘッダー
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "accept: application/json",
    "content-type: application/json",
    "x-api-key: $apiKey"
]);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
    exit;
}
curl_close($ch);

echo $response;