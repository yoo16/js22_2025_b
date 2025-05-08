$(() => {
    // Win: Ctrl + Shift + R
    // Mac: Cmd + Shift + R
    // TODO: id=title
    var titleElement = $('#title')
    console.log(titleElement.text())
    // バニラJS
    // var titleElement = document.getElementById('title')
    // console.log(titleElement.innerText)

    // TODO: class=city
    var cityElements = $('.city')
    console.log(cityElements)

    // TODO: id=jp-city の class=city
    var jpCityList = $('#jp-city .city')
    console.log(jpCityList)

    // TODO: id=us-city
    var usCityList = $('#us-city .city')
    console.log(usCityList)

    // TODO: html() 取得
    var title
    console.log(title)

    // TODO: html() 設定
    $('#title').html('JP City')
    // document.getElementById('title').innerHTML = 'JP City'

    // TODO: .city に addClass(): class="bg-gray-300"
    // bg-gray-300
    $('.city').addClass('bg-gray-300')
    $('.city').addClass('font-bold')

    // TODO: .city に removeClass()
    // bg-gray-300
    $('.city').removeClass('bg-gray-300')

    // TODO: get(): .city に指定インデックスで取得(バニラJS)

    // TODO: eq(): .city に指定インデックスで取得(jQueryオブジェクト)
    // TODO: eq(): .city の最初を取得し、class=bg-red-500 を追加
    $('.city').eq(0).addClass('bg-red-500')

    // TODO: first(): .city の最初を取得し、class=text-white を追加
    $('.city').first().addClass('text-white')

    // TODO: .city の最後を取得し、class=bg-red-500 を追加
    $('.city').last().addClass('bg-red-500 text-white')

    // TODO: .city をすべて取得し、class=bg-red-300 を削除

    // TODO: filter(): 指定した条件に一致した要素を選択
    // .city をすべて取得し、奇数に class=bg-gray-200 を追加

    // TODO: not(): 指定した条件に一致しない要素を選択
    // 奇数以外（偶数）の要素に class=bg-blue-300 を追加 
    $('.city').not(':odd').addClass('bg-blue-300')  

    // TODO: find(): 子孫要素を取得

    // TODO: slice(): 選択した要素を部分的に取得
    // 2番目から3番目の要素を取得し、class=bg-orange-500 を追加

    // nth-child()
    // TODO: id=us-city の class=city のインデックス「2」を選択
    var selectedCity
    // TODO: text() でコンテンツ表示
})