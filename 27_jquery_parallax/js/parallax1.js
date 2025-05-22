$(document).ready(function () {
    const $parallax = $('#parallax');
    const $parallaxContent = $('#parallaxContent');

    // TODO: スクロール: jqScroll
    $(window).scroll(function () { 
        // TODO: scrollY: スクロール位置を取得し、0.5 をかける
        const scrollY = $(this).scrollTop() * 0.5;
        // console.log(scrollY);

        // TODO: parallaxHeight: パララックス対象の高さ取得
        const parallaxHeight = $parallax.outerHeight();

        // TODO: バックグラウンド画像を上へ移動：background-position-y: -scrollY px
        $parallax.css({
            'background-position-y': -scrollY + 'px',
            'background-position-x': -scrollY + 'px',
        });

        // 文字コンテンツの移動距離計算
        const translateY = Math.min(parallaxHeight / 2, scrollY * 0.2);

        // TODO: 文字の位置を設定： transform: translateY(translateY px)
        $parallaxContent.css({
            'transform': 'translateY(' + translateY + 'px)',
        });

    });
    // $(window).on('scroll', function () {
        
    // });

});
