// Chart.jsのグローバルオブジェクト
let chart;

// データのラベル
const label = "";
// X軸のデータ
const labels = ['Red', 'Blue', 'Yellow'];
// const labels = [1, 2, 3];
// Y軸のデータ
const values = [12, 19, 3];
const backgroundColors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)'
];
const borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)'
];

// 初期グラフの描画
function renderChart() {
    // canvasからコンテキストを作成
    const ctx = document.getElementById('barChart').getContext('2d');
    // Chart.jsのインスタンスを作成
    chart = new Chart(ctx, {
        // TODO: グラフの種類を指定: 棒グラフ = bar
        type: 'bar',
        data: {
            // TODO: X軸のデータ: labels
            labels: labels,
            datasets: [{
                // TODO: データセットのラベル: labels を設定
                label: 'どんな色が好き？',
                // TODO: Y軸のデータ: values を設定
                data: values,
                // TODO: 塗りつぶしの色: backgroundColors を設定
                backgroundColor: backgroundColors,
                // TODO: 枠線の色: borderColors を設定
                borderColor: borderColors,
                // TODO: 枠線の太さ: 任意の数値を設定
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                // 凡例の表示設定
                legend: {
                    display: false
                }
            },
        }
    });
}

renderChart();