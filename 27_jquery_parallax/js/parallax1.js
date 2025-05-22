$(document).ready(function () {
    const $parallax = $('#parallax');
    const $parallaxContent = $('#parallaxContent');

    // TODO: スクロール: jqScroll
        // TODO: scrollY: スクロール位置を取得し、0.5 をかける
        // jqScrollTopGet
        const scrollY = 0
        // TODO: parallaxHeight: パララックス対象の高さ取得
        // jqOuterHeight
        const parallaxHeight = 0

        // TODO: バックグラウンド画像を上へ移動：background-position-y: -scrollY px
        // jqCssSet

        // 文字コンテンツの移動距離計算
        const translateY = Math.min(parallaxHeight / 2, scrollY * 0.2);

        // TODO: 文字の位置を設定： transform: translateY(translateY px)
        // jqCssSet
});
