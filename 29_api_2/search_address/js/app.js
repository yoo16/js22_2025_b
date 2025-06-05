const PREFECTURE_FILE_PATH = './data/prefectures.json';
const SEARCH_URI = "https://zipcloud.ibsnet.co.jp/api/search";

const errorDisplay = document.getElementById('error');

// 都道府県JSON読み込み（非同期）
// async function loadPrefectures() {
const loadPrefectures = async () => {
    try {
        // TODO: 都道府県JSON読み込み（非同期）: PREFECTURE_FILE_PATH
        const response = await fetch(PREFECTURE_FILE_PATH);
        if (!response.ok) {
            errorDisplay.innerHTML = '都道府県読み込みエラー';
            return;
        }
        // TODO: レスポンスされたJSONを、オブジェクトに変換（非同期）
        const prefectures = await response.json();
        console.log(prefectures);

        // 都道府県プルダウン作成
        renderPrefectures(prefectures);
    } catch (error) {
        errorDisplay.innerHTML = error;
    }
}

// 都道府県プルダウン作成
const renderPrefectures = (prefectures) => {
    // 都道府県データで繰り返し
    prefectures.forEach((prefecture) => {
        var option = document.createElement('option');
        // TODO: value に都道府県コード設定
        option.value = prefecture.code;
        // TODO: テキストに都道府県名設定
        option.innerHTML = prefecture.name;
        // selectタグに、optionタグ追加
        document.getElementById('prefecture').appendChild(option)
    })
}

// 郵便番号検索（非同期）
const searchAddress = async (zipcode) => {
    try {
        const query_param = new URLSearchParams({ zipcode: zipcode, })
        // TODO: SEARCH_URI に zipcode を追加
        // https://zipcloud.ibsnet.co.jp/api/search?zipcode=1234567
        const uri = SEARCH_URI + '?' + query_param.toString();
        console.log(uri);
        // TODO: 郵便番号検索APIにアクセス（非同期）
        const response = await fetch(uri);
        // TODO: JSONデータを変換（非同期）
        const data = await response.json();
        return data;
    } catch (error) {
        errorDisplay.innerHTML = error;
    }
}

const searchHandler = async () => {
    const zipcode = document.getElementById('zipcode').value;
    if (!zipcode) {
        errorDisplay.innerHTML = '郵便番号を入力してください';
        return;
    }
    // 非同期で searchAddress() を実行
    const data = await searchAddress(zipcode);
    console.log(data);
    if (data.results) {
        const results = data.results[0];
        // TODO: value に都道府県コード設定: prefcode
        document.getElementById('prefecture').value = results.prefcode;
        // TODO: テキストボックスに住所設定: address2, address3
        document.getElementById('city').value = results.address2 + results.address3;
    } else {
        errorDisplay.innerHTML = data.message;
    }
}

(() => {
    loadPrefectures();
})();