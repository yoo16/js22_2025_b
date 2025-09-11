<?php
session_name('sid');
session_set_cookie_params([
    'lifetime' => 3600,
    'path'     => '/',
    'secure'   => false, // 本番は true
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();