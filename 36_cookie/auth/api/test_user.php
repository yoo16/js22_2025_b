<?php
// テスト用ユーザ（ハードコード）
$user = [
    'email' => 'test@test.com',
    'name'  => 'Test User',
    'hash_password'  => password_hash('secret123', PASSWORD_DEFAULT),
];