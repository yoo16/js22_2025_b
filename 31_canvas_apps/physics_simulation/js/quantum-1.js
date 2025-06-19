let numParticles = 3; // 量子（波）の数
let waves = [];
let time = 0;
const speed = 1;

function setup() {
    createCanvas(600, 400);

    // 初期化：ランダムな位置と波数
    for (let i = 0; i < numParticles; i++) {
        waves.push({
            x: random(width),
            y: height / 2,
            k: random(0.02, 0.05), // 波数
            w: random(0.02, 0.05), // 角周波数
            phase: random(TWO_PI)  // 初期位相
        });
    }
}

/**
 * draw()
 */
function draw() {
    background(0);
    stroke(255);
    noFill();

    let step = 5; // 解像度
    for (let x = 0; x < width; x += step) {
        let sumWave = 0;

        for (let wave of waves) {
            sumWave += sin(wave.k * (x - wave.x) - wave.w * time + wave.phase);
        }

        let y = height / 2 + sumWave * 20;
        ellipse(x, y, 3, 3);
    }
    // 時間更新
    time += speed;
}
