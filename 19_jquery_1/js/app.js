// バニラJSで、DOM読み込み後にアラート表示
// Win: Ctrl + /
// Mac: Cmd + /

document.addEventListener("DOMContentLoaded", function () {
    alert("バニラJS")
})

// あってるのに実行されない場合
// Win: Ctrl + Shift + R
// Mac: Cmd + Shift + R

// TODO: jQueryで、DOM(HTML)読み込み後にアラート表示
$(function () {
    // HTMLがすべてブラウザで読み込まれた時に実行
    alert('はじまるよー')
});

alert('つぎいきます！')

// TODO:DOM読み込み前の処理