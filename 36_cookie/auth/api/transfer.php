<?php
session_name('sid');
session_start();

header('Content-Type: application/json; charset=utf-8');

// 認証チェック
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// CSRFチェック
$headers = array_change_key_case(getallheaders(), CASE_LOWER);
$csrfHeader = $headers['x-csrf-token'] ?? null;
if (!$csrfHeader || $csrfHeader !== ($_SESSION['csrf_token'] ?? '')) {
    http_response_code(403);
    echo json_encode(['error' => 'Invalid CSRF token']);
    exit;
}

// 入力
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$to = $input['to'] ?? '';
$amount = (int)($input['amount'] ?? 0);

// ダミー送金処理
if ($to && $amount > 0) {
    echo json_encode([
        'ok' => true,
        'from' => $_SESSION['user']['email'],
        'to' => $to,
        'amount' => $amount,
        'message' => 'Transfer completed'
    ]);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid transfer data']);
}