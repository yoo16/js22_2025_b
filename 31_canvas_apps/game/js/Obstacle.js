// 障害物クラス（ちらつき防止のため、Y軸にオフセットを追加）
class Obstacle {
    constructor(x, y, z) {
        this.pos = createVector(x, y, z);
        this.w = random(50, 150);  // 幅
        this.h = random(100, 300); // 高さ
        this.d = this.w;           // 奥行き（幅と同じにする場合）
    }

    display() {
        push();
        // 障害物の底面が地面と重ならないように、Y軸方向にオフセットを追加
        // 障害物の底面が地面にぴったりくるように、translate()で高さの半分だけ上にずらす
        translate(this.pos.x, -(this.pos.y + this.h / 2 - 1), this.pos.z);
        // 塗りつぶし
        fill(250, 250, 250);
        // 幅、(高さ)、奥行きを指定して箱を描画
        box(this.w, this.h, this.d);
        pop();
    }
}

/**
 * sphereBoxCollision
 * 
 * 衝突判定関数（球体と軸整列境界ボックスの衝突判定）
 * 障害物は、中心が (box.pos.x, box.pos.y + box.h/2, box.pos.z)
 * 半径は (box.w/2, box.h/2, box.d/2)
 * 
 * @param float sphereCenter: プレイヤーの中心位置（p5.Vector）
 * @param falot sphereRadius: プレイヤーの半径
 * @param Obstacle box: 障害物オブジェクト（Obstacle）
 * @returns 
 */
function sphereBoxCollision(sphereCenter, sphereRadius, box) {
    // 障害物の表示上の中心座標を計算（Y軸は反転しているので同じ処理を行う）
    let boxCenter = createVector(
        box.pos.x,
        -(box.pos.y + box.h / 2 - 1), // Y 軸の反転を反映
        box.pos.z
    );
    let halfW = box.w / 2;
    let halfH = box.h / 2;
    let halfD = box.d / 2;

    // 障害物のAABBの最小値・最大値
    let minX = boxCenter.x - halfW;
    let maxX = boxCenter.x + halfW;
    let minY = boxCenter.y - halfH;
    let maxY = boxCenter.y + halfH;
    let minZ = boxCenter.z - halfD;
    let maxZ = boxCenter.z + halfD;

    // プレイヤーの中心から、障害物のAABB内にクランプした座標を取得
    let closestX = constrain(sphereCenter.x, minX, maxX);
    let closestY = constrain(sphereCenter.y, minY, maxY);
    let closestZ = constrain(sphereCenter.z, minZ, maxZ);

    // クランプした点とプレイヤー中心との距離の二乗
    let distanceSq = (closestX - sphereCenter.x) ** 2 +
        (closestY - sphereCenter.y) ** 2 +
        (closestZ - sphereCenter.z) ** 2;
    return distanceSq < (sphereRadius * sphereRadius);
}
