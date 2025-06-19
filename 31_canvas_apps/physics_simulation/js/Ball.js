class Ball {
    constructor(x, y, radius) {
        // 位置
        this.position = createVector(x, y);
        // 初期位置を記録（reset 時に利用）
        this.initialPosition = createVector(x, y);
        // 速度（初期状態は 0）
        this.velocity = createVector(0, 0);
        // 加速度ベクトル（初期状態は 0）
        this.acceleration = createVector(0, 0);
        // 半径
        this.radius = radius;
        // 反発係数（0～1、1に近いほど跳ね返りが強い）
        this.restitution = 0.8;
        // 重力定数（初期値 0.5）
        this.gravity = 0.5;
    }

    // 状態の更新（物理計算など）
    update() {
        // 常に重力を適用（スペースキーに関係なく）
        this.acceleration = createVector(0, this.gravity);

        // 速度に加速度を加える
        this.velocity.add(this.acceleration);
        // 位置を更新
        this.position.add(this.velocity);

        // 床との衝突判定（床：canvas 下端）
        if (this.position.y + this.radius > height) {
            this.position.y = height - this.radius;
            this.velocity.y *= -this.restitution;
        }
        // 左側の壁との衝突判定
        if (this.position.x - this.radius < 0) {
            this.position.x = this.radius;
            this.velocity.x *= -this.restitution;
        }
        // 右側の壁との衝突判定
        if (this.position.x + this.radius > width) {
            this.position.x = width - this.radius;
            this.velocity.x *= -this.restitution;
        }
    }

    // オブジェクトの描画
    display() {
        // 画像の描画位置が中心になるように設定
        imageMode(CENTER);
        
        // ballImage は preload() で読み込んだグローバル変数です
        if (ballImage) {
            image(ballImage, this.position.x, this.position.y, this.radius * 2, this.radius * 2);
        } else {
            // ballImage が読み込めなかった場合のフォールバック
            fill(100, 255, 100);
            stroke(100, 200, 100);
            ellipse(this.position.x, this.position.y, this.radius * 2);
        }
    }

    // ステタス表示
    displayStatus() {
        // ステータス文字列の作成（数値は toFixed(2) で小数点以下2桁に）
        let statusText =
            "Position: (" + this.position.x.toFixed(2) + ", " + this.position.y.toFixed(2) + ")<br>" +
            "Velocity: (" + this.velocity.x.toFixed(2) + ", " + this.velocity.y.toFixed(2) + ")<br>" +
            "Acceleration: (" + this.acceleration.x.toFixed(2) + ", " + this.acceleration.y.toFixed(2) + ")<br>" +
            "Gravity: " + this.gravity.toFixed(2) + "<br>" +
            "Restitution: " + this.restitution.toFixed(2);

        // HTML の DOM 要素にステータスを出力
        document.getElementById("status").innerHTML = statusText;
    }

    // 位置、速度、加速度を初期状態に戻す
    reset() {
        this.position = this.initialPosition.copy();
        this.velocity.set(0, 0);
        this.acceleration.set(0, 0);
    }
}
