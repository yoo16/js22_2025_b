<?php
require 'session_init.php';

header('Content-Type: application/json; charset=utf-8');

// 認証チェック
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// CSRFチェック
if (!isset($_SESSION['csrf_token'])) {
    http_response_code(403);
    echo json_encode(['error' => 'CSRF token not initialized']);
    exit;
}

// 正常レスポンス
echo json_encode([
    'user' => $_SESSION['user'],
]);
