// jQuery animate()
$(document).ready(function () {
    // 次へボタンのクリックイベント1
    $('#next-button1').on('click', function () {
        stackAnimation1();
    });

    // 次へボタンのクリックイベント2
    $('#next-button2').on('click', function () {
        stackAnimation2();
    });
});

// クリック後の処理
function stackAnimation1() {
    // id=image-container の子 class=stacked-item のスタックリスト取得（画像リスト）
    const images = $('#image-container').children('.stacked-item');
    // TODO: imagesから 最上位のスタック取得: last()
    const topImage = images.last();

    // 間違えたので、$ をはずして
    topImage.animate({
            opacity: 0.8,
            left: '100%',
            marginTop: '-50px',
        }, 500,
            // アニメーション終了後の処理
            function () {
                resetPosition()
            }
        );

    // 元に戻すアニメーション
    function resetPosition() {
        // TODO: 重ね順をオート設定: css('z-index', 'auto')

        // TODO: 元の位置に戻すアニメーション
        // 1. topImage を id=image-container の先頭に移動: prependTo()
        // 2. アニメーション: left: 0, top: 0, opacity: 0
        topImage.prependTo('#image-container').animate({
            left: 0,
            marginTop: 0,
            opacity: 1,
        }, 500);
    }
}

function stackAnimation2() {
    // id=image-container の子 class=stacked-item のスタックリスト取得（画像リスト）
    const images = $('#image-container').children('.stacked-item');
    // 最上位のスタック取得: last()
    const topImage = images.last();

    // TODO: フェードアウト: class=swipe-out
    topImage.addClass('swipe-out');

    // 移動終了後の処理
    // CSSアニメーションが終わったら実行（1度だけ）
    topImage.one('transitionend', function () {
        // 要素を先頭に移動
        topImage.prependTo('#image-container');
        swipeIn();
    });

    // スライドインアニメーション
    function swipeIn() {
        setTimeout(() => {
            // スライドアウトアニメーション削除
            topImage.removeClass('swipe-out');
            // スライドインアニメーション追加
            topImage.addClass('swipe-in');

            topImage.one('transitionend', function () {
                // スライドインアニメーション削除
                topImage.removeClass('swipe-in');
            });
        }, 100);
    }
}