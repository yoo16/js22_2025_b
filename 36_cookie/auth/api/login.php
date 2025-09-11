<?php
// テスト用ユーザ
require 'test_user.php';

// セッションCookie設定
require 'session_init.php';

// POST 以外は拒否
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

// 入力取得
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if ($email === $user['email'] && password_verify($password, $user['hash_password'])) {
    unset($user['hash_password']);
    $_SESSION['user'] = $user;

    // 認証成功時に CSRFトークンを発行・保存
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

    // レスポンスにトークンを含めてもOK（JSで使う場合）
    echo json_encode([
        'ok' => true,
        'message' => 'logged in',
        'csrf_token' => $_SESSION['csrf_token'],
    ]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
}