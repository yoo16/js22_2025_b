let camAngle = 0;    // カメラアングル（ラジアンで管理）
let player;          // プレイヤーオブジェクト
let obstacles = [];  // 障害物を格納する配列
const numObstacles = 20; // 障害物の数
const playerSize = 20;

function preload() {
    playerImage = loadImage("assets/player.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    // p5.js の内部 WebGL コンテキストを取得
    let gl = this._renderer.GL;

    // WEBGL_debug_renderer_info 拡張を取得
    let debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
        let vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        console.log("GPU Vendor: " + vendor);
        console.log("GPU Renderer: " + renderer);
    } else {
        console.log("WEBGL_debug_renderer_info is not available.");
    }

    // その他の初期化処理
    player = new Player(playerSize);
    for (let i = 0; i < numObstacles; i++) {
        let x = random(-500, 500);
        let z = random(-500, 500);
        obstacles.push(new Obstacle(x, 0, z));
    }
}


function draw() {
    background(200, 220, 255);

    // プレイヤーの状態を更新
    player.update();

    // カメラの回転
    handleCameraRotation();

    // カメラの設定
    let cameraDistance = 400;
    let camX = player.pos.x - sin(radians(camAngle)) * cameraDistance;
    let camZ = player.pos.z - cos(radians(camAngle)) * cameraDistance;
    let camY = player.pos.y - 200;
    camera(camX, camY, camZ, player.pos.x, player.pos.y, player.pos.z, 0, 1, 0);

    // 地面の描画
    push();
    rotateX(HALF_PI);
    fill(180, 240, 180);
    noStroke();
    plane(2000, 2000);
    pop();

    // 障害物の描画
    for (let obs of obstacles) {
        obs.display();
    }

    // プレイヤーの描画
    player.display();

    // 操作方法を表示
    resetMatrix();
    fill(0);
    textSize(16);
    text("矢印キー: カメラ回転/前後移動, Space: ジャンプ, X: 下降", 10, 30);
}

// カメラ回転処理
function handleCameraRotation() {
    if (keyIsDown(LEFT_ARROW)) {
        // TODO: 左回転
        camAngle += 0;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        // TODO: 右回転
        camAngle -= 0;
    }
}