// Canvas の取得
const lineChart = document.getElementById('lineChart');
// コンテキストの取得
const ctx = lineChart.getContext('2d');
// データのラベル
const label = '1週間のデータ';
// x軸に睡眠時間
const labels = [4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11, 12];
// y軸に生産性
const data = [2, 3, 5, 7, 8, 9, 8, 6, 5];
// 背景色と境界線の色
const backgroundColor = 'rgba(54, 162, 235, 0.7)';
const borderColor = 'rgba(54, 162, 235, 1)';
const pointRadius = 6;

async function createLineChart() {
    new Chart(ctx, {
        // 折れ線グラフ
        type: 'line',
        data: {
            // TODO: ラベルを設定（x軸の値）
            labels: labels,
            // TODO: データセット（y軸の値）
            datasets: [{
                label: '1週間のデータ',
                data: data,
            }]
        },
        // オプション
        options: {
            plugins: {
                tooltip: {
                    // TODO: コールバックでツールチップの表示内容をカスタマイズ
                    callbacks: {
                        label: function (context) {
                            const sleep = context.label;
                            const productivity = context.raw;
                            return `睡眠: ${sleep}時間 / 生産性: ${productivity}`;
                        }
                    }
                }
            },
            // 軸の設定
            scales: {
                // TODO: X軸のタイトル
                x: {
                    title: {
                        display: true,
                        text: '睡眠時間（時間）',
                    },
                    ticks: {
                        stepSize: 1
                    }
                },
                // TODO: Y軸のタイトル
                y: {
                    title: {
                        display: true,
                        text: '生産性（1〜10）',
                    },
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

createLineChart()