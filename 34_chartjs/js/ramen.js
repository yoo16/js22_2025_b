const messageContainer = document.getElementById('message');
const totalContainer = document.getElementById('total-container');
// canvas
const barChart = document.getElementById('barChart');
const pieChart = document.getElementById('pieChart');
// context
const barCtx = barChart.getContext('2d');
const pieCtx = pieChart.getContext('2d');

/**
 * APIからデータ取得
 * @returns 
 */
async function loadRamenData() {
    const uri = 'api/ramen.json';
    // APIからデータを取得
    const response = await fetch(uri);
    messageContainer.innerHTML = '';
    if (!response.ok) {
        messageContainer.innerHTML = 'データ取得失敗';
    }
    // JSONデータをパース
    return await response.json();
}

/**
 * 合計票数を表示
 * @param {*} labels 
 * @param {*} groups 
 */
function renderTotal(labels, groups) {
    // 合計票数を集計
    const totalList = getTotalData(labels, groups);

    // TODO: 得票数で降順にソート
    // totalList.sort((a, b) => b.total - a.total);

    // カードHTML生成（No付き）
    const cards = totalList.map((item, index) => `
        <div class="bg-white border-b py-2 w-full">
            <div class="font-bold">No.${index + 1}</div>
            <div class="flex flex-col gap-2 items-center">
                <div class="font-semibold">${item.label}</div>
                <div class="text-center text-red-600 font-bold">${item.total}票</div>
            </div>
        </div>
    `);

    // カード表示
    totalContainer.innerHTML += cards;
}

/**
 * 棒グラフを生成
  * @param {*} labels 
  * @param {*} groups 
  * @param {*} colors 
 */
function createBarChart(labels, groups, colors) {
    // TODO:データを整形
    const datasets = groups.map((group, index) => ({
        label: group.name,
        data: group.data,
    }));

    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            // TODO: stepSizeを指定
            scales: {
                y: {
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

/**
 * 円グラフを生成
 * @param {*} labels 
 * @param {*} values 
 * @param {*} groupName 
 */
function createPieChart(labels, groups) {
    // 全体の合計データを作成（各ラーメンごとに集計）
    const values = getTotalValues(labels, groups);

    new Chart(pieCtx, {
        type: 'pie',
        data: {
            datasets: [{
                data: values,
            }]
        },
        plugins: [{
            id: 'pieLabelInside',
            // TODO: 円グラフの中心にラベルを表示
            afterDraw(chart) {
                // const { ctx } = chart;
                // const meta = chart.getDatasetMeta(0);
                // ctx.font = 'bold 18px sans-serif';
                // ctx.fillStyle = 'white';

                // // 円グラフの中心に合計値を表示
                // meta.data.forEach((arc, i) => {
                //     const angle = (arc.startAngle + arc.endAngle) / 2;
                //     const radius = (arc.innerRadius + arc.outerRadius) / 2;
                //     const x = arc.x + Math.cos(angle) * radius;
                //     const y = arc.y + Math.sin(angle) * radius;
                //     ctx.fillText(labels[i], x, y);
                // });
                // ctx.restore();
            }
        }]
    });
}

/**
 * 全体の合計データを作成
 * @param {*} labels 
 * @param {*} groups 
 * @returns 
 */
function getTotalData(labels, groups) {
    return labels.map((label, i) => ({
        label,
        total: groups.reduce((sum, group) => sum + (group.data[i] || 0), 0)
    }));
}

/**
 * 全体の合計値を取得
 * @param {*} labels 
 * @param {*} groups 
 * @returns 
 */
function getTotalValues(labels, groups) {
    return getTotalData(labels, groups).map(item => item.total);
}

async function main() {
    // データを取得
    const { labels, colors, groups } = await loadRamenData();

    // ランキングリスト
    renderTotal(labels, groups);

    // 棒グラフ
    createBarChart(labels, groups, colors);

    // 円グラフ
    createPieChart(labels, groups);
}

main();