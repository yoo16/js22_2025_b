<?php
// セッションCookie設定
require 'session_init.php';

header('Content-Type: application/json; charset=utf-8');

// セッション変数を空に
unset($_SESSION['user']);

// セッションCookieの削除（有効期限を過去に設定）
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(), // name
        '',             // value
        time() - 42000, // expire
        '/',            // path
        '',             // domain
        false,          // secure
        true            // httponly
    );
}

// レスポンス返却
echo json_encode([
    'ok' => true,
    'message' => 'Logged out successfully'
]);
