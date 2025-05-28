const centerContainer = document.getElementById('center-container');
const officeContainer = document.getElementById('office-container');
const weatherContainer = document.getElementById('weather-container');
const reportedAtContainer = document.getElementById('reported-at');
const topicContainer = document.getElementById('topics');
const errorContainer = document.getElementById('error');

var centerData;
var forecastData;
var weatherData;
var centers;
var offices;

/**
 * getCenter
 * API取得: エリアセンターデータ
 * @returns 
 */
async function getCenter() {
    try {
        // API URIの設定: https://www.jma.go.jp/bosai/common/const/area.json
        const uri = '';
        // const uri = './data/jma-area.json';
        const response = await fetch(uri);
        if (!response.ok) {
            displayError("エリア取得に失敗しました");
        }
        return await response.json();
    } catch (error) {
        displayError("APIエラー");
    }
}

/**
 * getForecast
 * API取得: 天気予報データ
 * @returns 
 */
async function getForecast(officeCode) {
    try {
        // TODO: API URIの設定: https://www.jma.go.jp/bosai/forecast/data/forecast/xxxxx.json
        const uri = '';
        // const uri = "./data/dummy.json";
        console.log(uri)
        const response = await fetch(uri);
        if (!response.ok) {
            displayError("予想データ取得に失敗しました");
        }
        return await response.json();
    } catch (error) {
        displayError("APIエラー");
    }
}

/**
 * displayCenters
 * エリアセンター表示
 */
async function displayCenters() {
    try {
        // Fetch API データ
        centerData = await getCenter();
        centers = centerData.centers;
        offices = centerData.offices;

        for (const centerCode in centers) {
            const center = centers[centerCode];
            var div = document.createElement('div');
            div.className = 'area-btn bg-white px-4 py-2 rounded';
            div.dataset.centerCode = centerCode;

            var h2 = document.createElement('h2');
            h2.textContent = center.name;
            h2.className = 'text-2xl font-bold py-2';

            div.appendChild(h2);

            const ul = document.createElement('ul')
            for (const officeCode of center.children) {
                const li = document.createElement('li');
                const office = offices[officeCode];
                li.textContent = office.name;
                li.dataset.officeCode = officeCode;
                li.className = 'text-sky-600 cursor-pointer';
                // クリックイベント
                li.addEventListener('click', () => displayWeather(officeCode));
                ul.appendChild(li)
            }
            div.appendChild(ul);
            centerContainer.appendChild(div);
        }
    } catch (error) {
        displayError(error);
    }
}

/**
 * displayWeather
 * 天気表示
 * @param {*} officeCode 
 */
async function displayWeather(officeCode) {
    // ローディングスピナーを表示
    const loadingSpinner = document.getElementById("loading-spinner");
    loadingSpinner.classList.remove("hidden");

    // 現在のリストクリア
    weatherContainer.innerHTML = '';
    errorContainer.innerHTML = '';

    try {
        console.log(`Office Code: ${officeCode}`);
        forecastData = await getForecast(officeCode);
        console.log(forecastData);

        // スムーススクロールでトップへ移動
        document.getElementById("title").scrollIntoView({ behavior: "smooth" });
        // 予報日時
        reportedAtContainer.textContent = dateFormat(forecastData[0].reportDatetime);
        // 天気データ
        const weathers = forecastData[0].timeSeries[0].areas;
        // 降水量
        const precipitations = forecastData[0].timeSeries[1].areas;
        // 予報基本データ
        const areas = forecastData[0].timeSeries[2].areas;

        // 天気カード生成
        areas.forEach((value, index) => {
            console.log("value: ", value)

            // 天気データのある地域のみ処理
            if (!weathers[index]) return;

            // 都市名
            const name = value.area.name;
            // 気温（最低、最高）
            const temperature = value.temps;
            // 天気データ
            const weather = weathers[index];
            // 天気コード
            const code = weather.weatherCodes[0];
            // 転記画像
            const image = weatherCodes[code][0];
            // 天気名
            const weatherName = weather.weathers[0];
            // 降水確率
            const precipitaion = precipitations[index].pops[0];

            const card = document.createElement('div');
            card.className = 'bg-white shadow-md rounded-lg p-3 text-center';
            // TODO: 気象データをバインド
            card.innerHTML = `
                    <h2 class="text-md font-bold mb-2"></h2>
                    <p class="flex justify-center">
                        <img class="w-12 h-12" src="svg/" alt="">
                    </p>
                    <p class="text-gray-500">
                        <span class="text-red-500 font-bold"></span>
                        /
                        <span class="text-blue-500 font-bold"></span>
                    </p>
                    <p class="text-gray-500">%</p>
                `;
            weatherContainer.appendChild(card);
        });
    } catch (error) {
        displayError("予報データがありません。");
    } finally {
        // ローディングスピナーを非表示
        loadingSpinner.classList.add("hidden");
    }
}


/**
 * エラーメッセージ
 * @param {*} error 
 */
function displayError(error) {
    errorContainer.innerHTML = error;
}

function dateFormat(dateString) {
    // 日付オブジェクトを作成
    const date = new Date(dateString);
    // フォーマット
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    return formattedDate;
}

document.addEventListener('DOMContentLoaded', () => {
    // 気象センター表示
    displayCenters();
});
