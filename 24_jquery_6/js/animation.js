$(function () {
    var character_1 = $("#character_1");
    var character_2 = $("#character_2");
    var character_3 = $("#character_3");
    var character_4 = $("#character_4");
    var box1 = $("#box1");
    var box2 = $("#box2");

    $("#showBtn").on("click", function () {
        // TODO: character_1 を show() で表示
        character_1.show();
    });

    $("#hideBtn").on("click", function () {
        // TODO: character_1 を hide() で非表示
        character_1.hide();
    });

    $("#toggleBtn").on("click", function () {
        // TODO: character_1 を toggle() でトグル表示
        character_1.toggle();
    });

    $("#fadeInBtn").on("click", function () {
        // TODO: character_2 を fadeIn() でフェードイン
        character_2.fadeIn();
    });

    $("#fadeOutBtn").on("click", function () {
        // TODO: character_2 を fadeOut() でフェードアウト
        character_2.fadeOut();
    });

    $("#fadeToggleBtn").on("click", function () {
        // TODO: character_2 を fadeToggle() でフェードトグル
        character_2.fadeToggle();
    });

    $("#slideDownBtn").on("click", function () {
        // TODO: character_3 を slideDown() でスライド表示
        character_3.slideDown();
    });

    $("#slideUpBtn").on("click", function () {
        // TODO: character_3 を slideUp() でスライド非表示
        character_3.slideUp();
    });

    $("#slideToggleBtn").on("click", function () {
        // TODO: character_3 を slideToggle() でスライドトグル
        character_3.slideToggle();
    });

    $("#shakeBtn").on("click", function () {
        const distance = 10; // 揺れ幅
        const delay = 50;   // 揺れの間隔
        const times = 4;     // 揺れる回数

        function shake(element, count) {
            if (count > 0) {
                // console.log(element);
                // TODO: アニメーションで左に揺らす
                element.animate({ left: "-=" + distance }, delay)
                // TODO: アニメーションで右に揺らす
                element.animate({ left: "+=" + distance }, delay)
                // TODO: コールバックで再帰的に shake() を呼び出す
                shake(element, count - 1);
            } else {
                // TODO: 最後に元の位置へ戻す
            }
        }
        shake(character_4, times);
    });

    $("#easingBtn").on("click", function () {
        initBox();
        // TODO: box1 を width=300px でアニメーション: easing=linear
        box1.animate({ width: "300px" }, 1500, "linear")
        // TODO: box2 を width=300px でアニメーション: easing=swing
        box2.animate({ width: "300px" }, 1500, "swing")
    })

    $("#animateBtn").on("click", function () {
        // TODO: box1 を width=300px height=50px opacity: 0.1 でアニメーション
        // TODO: box1 を width=100px height=100px opacity: 1 でアニメーション
        box1.animate({ width: "300px", height: "50px", opacity: 0.1 }, 1000)
            .animate({ width: "100px", height: "100px", opacity: 1 }, 1000)

        // TODO: box2 を width=0px opacity: 0.1 でアニメーション
        // TODO: box2 を width=200px opacity: 1 でアニメーション
        // TODO: box2 を 1秒待機して width=100px opacity: 1 でアニメーション
        box2.animate({ width: "0px", opacity: 0.1 }, 500)
            .animate({ width: "200px", opacity: 1 }, 500)
            .delay(1000)
            .animate({ width: "100px", opacity: 1 }, 1000)
    });

    $("#queueBtn").on("click", function () {
        const items = $('.item');
        items.addClass('hidden');

        const delayTime = 300;

        // items 繰り返し(each)
        items.each(function (i) {
            // TODO: delay().queure() を実行
            // TODO: コールバックで、class=hidden を削除
            // TODO: dequeue()
            $(this).delay(i * delayTime).queue(function () {
                $(this).dequeue();
            }).fadeIn();

            // setTimeout(() => {
            //     $(this).fadeIn();
            // }, i * delayTime);
        });
    });

    function initBox() {
        box1.removeClass("bg-green-400").addClass("bg-blue-400");
        box1.css({
            width: "100px",
            height: "100px"
        });
        box2.removeClass("bg-blue-400").addClass("bg-green-400");
        box2.css({
            width: "100px",
            height: "100px"
        });
    }

    initBox();
});