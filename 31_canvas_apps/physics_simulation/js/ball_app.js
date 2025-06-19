let ball;
let ballImage;
let simulationRunning = false;
const initX = window.innerWidth / 2;
const initY = 50;
const radius = 30;
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");

function preload() {
    // TODO: 画像ファイルのパスを指定して読み込みます
    // ballImage = loadImage("assets/player.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    // ボールの初期位置は画面中央上部
    ball = new Ball(initX, initY, radius);

    // HTML のボタン要素を取得してイベントリスナーを設定

    // start ボタンがクリックされたらシミュレーションを開始
    startButton.addEventListener("click", function () {
        simulationRunning = true;
    });

    // reset ボタンがクリックされたらボールを初期化しシミュレーションを停止
    resetButton.addEventListener("click", function () {
        simulationRunning = false;
        ball.reset();
    });
}

function draw() {
    background(255, 255, 255);

    // HTML のスライダーから値を読み取り、ball に反映
    let gravityValue = parseFloat(document.getElementById("gravitySlider").value);
    let restitutionValue = parseFloat(document.getElementById("restitutionSlider").value);
    ball.gravity = gravityValue;
    ball.restitution = restitutionValue;

    // スライダーの現在の値を隣の <span> に表示
    document.getElementById("gravityValue").innerText = gravityValue.toFixed(2);
    document.getElementById("restitutionValue").innerText = restitutionValue.toFixed(2);

    // TODO: シミュレーション実行中なら物理更新: update()
    if (simulationRunning) {
        // ball.update();
    }
    ball.display();
    ball.displayStatus();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}