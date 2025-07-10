const messageContainer = document.getElementById('message-container');
const salesContainer = document.getElementById('sales-chart');
const softwaresContainer = document.getElementById('softwares-chart');

// グローバル変数で管理
let salesChart;
let softwaresChart;

// 初期データ
let salesData = {
    labels: [],
    datasets: [{
        label: '',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
    }]
};

let softwaresData = {
    labels: [],
    datasets: [{
        label: '',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
    }]
};

// 初期オプション
let salesOptions = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

let softwareOptions = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};


// 売上のチャートを生成する関数
function createSalesChart(type, data, options) {
    const ctx = salesContainer.getContext('2d');
    salesChart = new Chart(ctx, {
        type: type,
        data: data,
        options: options
    });
}

// ソフトウェアのチャートを生成する関数
function createSoftwaresChart(type, data, options) {
    const ctx = softwaresContainer.getContext('2d');
    softwaresChart = new Chart(ctx, {
        type: type,
        data: data,
        options: options
    });
}

// 共通の非同期データ取得関数
async function loadData(uri) {
    try {
        const results = await fetch(uri);
        if (!results.ok) {
            messageContainer.innerHTML = "データ取得エラー";
            return;
        }
        const data = await results.json();
        return data;
    } catch (error) {
        messageContainer.innerHTML = "データ取得エラー";
    }
}

// 売上データを取得する関数
async function loadSalesData() {
    salesData = await loadData('api/sales.json');
}

// ソフトウェアデータを取得する関数
async function loadSoftwaresData() {
    softwaresData = await loadData('api/softwares.json');
}

// 棒グラフを描画する関数（売上チャート用）
function barChart() {
    if (salesChart) {
        salesChart.destroy();
    }
    createSalesChart('bar', salesData, salesOptions);
}

// 折れ線グラフを描画する関数（売上チャート用）
function lineGraph() {
    if (salesChart) {
        salesChart.destroy();
    }
    createSalesChart('line', salesData, salesOptions);
}

// 円グラフを描画する関数（ソフトウェアチャート用）
function pieChart() {
    if (softwaresChart) {
        softwaresChart.destroy();
    }
    createSoftwaresChart('pie', softwaresData, softwareOptions);
}

// ドーナツグラフを描画する関数（ソフトウェアチャート用）
function doughnutChart() {
    if (softwaresChart) {
        softwaresChart.destroy();
    }
    createSoftwaresChart('doughnut', softwaresData, softwareOptions);
}

// グラフの初期化関数
(async function initChart() {
    // 売上データを取得
    await loadSalesData();
    // 売上データ取得後にグラフを描画
    barChart();

    // ソフトウェアデータ取得
    await loadSoftwaresData();
    // ソフトウェアデータ取得後にグラフを描画
    createSoftwaresChart('pie', softwaresData, softwareOptions);
})();