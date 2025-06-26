import * as THREE from 'three';
export class CustomSinCurve extends THREE.Curve {
    constructor(scale = 1) {
        super();
        this.scale = scale;
    }
    getPoint(t) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(t * Math.PI * 2);
        const tz = 0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    }
}