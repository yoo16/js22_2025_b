// バニラJS
// document.getElementById('click-button').addEventListener("click", function () { 
//     $("#result-event").text('クリックしました')
//  })

// TODO: クリックイベント
$("#click-button").on("", function () {
    // TODO: id=input-text のデータを取得
    var userName = "";
    if (userName) {
        var message = userName + "さん、ようこそ！";
        $("#result-event").text(message);
    }
});

$('#input-text').on({
    // TODO: inputイベント
    "": function () {
        // TODO: 入力されたテキストを取得
        const inputText = "";
        $("#result-event").text(inputText);
    },
    focus: function () {
        // TODO: フォーカスされた時に class=bg-blue-100 を追加
        $(this).addClass('bg-blue-100')
    },
    blur: function () {
        // TODO: フォーカスがはずれた時に class=bg-blue-100 を削除
    }
});

// change イベント
$('#character-select').on('change', function () {
    // TODO: $(this) を使ってプルダウンで選択された value を取得
    const id = 0;
    updateImage(id);
});

// click イベント
$('#character-list li').on('click', function () {
    // TODO: $(this) を使って data-character を取得
    const id = 0;
    updateImage(id);
});

// 画像更新
function updateImage(id) {
    const imagePath = `images/character_${id}.png`;
    // TODO: id=character-image の src に imagePath を設定
    $('#character-image');
}

// mouseイベントハンドラー
const mouseOverHandler = function (event) {
    $(this).attr('src', 'images/character_5.png');
}

const mouseOutHandler = function (event) {
    $(this).attr('src', 'images/character_4.png');
}

// mouseイベント
$('#hoverBox')
    // TODO: マウスオーバーで、mouseOverHandler を実行
    // TODO: mouseOutHandler を実行

// mouseイベント削除
$('#event-off-button').on('click', function () {
    $('#hoverBox').off('mouseover', mouseOverHandler)
    $('#hoverBox').off('mouseout', mouseOutHandler)
});