import { IPointData } from "pixi.js";

export function checkPointCircleCollision(
    point: IPointData,
    center: IPointData,
    radius: number
) {
    return (
        Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2) <=
        Math.pow(radius, 2)
    );
}

export function checkLineCircleCollision(
    p1: IPointData,
    p2: IPointData,
    center: IPointData,
    radius: number
) {
    const ax = p1.x - center.x;
    const ay = p1.y - center.y;
    const bx = p2.x - center.x;
    const by = p2.y - center.y;
    const a = Math.pow(bx - ax, 2) + Math.pow(by - ay, 2);
    const b = 2 * (ax * (bx - ax) + ay * (by - ay));
    const c = ax ** 2 + ay ** 2 - radius ** 2;
    const disc = b ** 2 - 4 * a * c;

    if (disc <= 0) return false;

    const t1 = (-b + Math.sqrt(disc)) / (2 * a);
    const t2 = (-b - Math.sqrt(disc)) / (2 * a);
    if ((0 < t1 && t1 < 1) || (0 < t2 && t2 < 1)) return true;
    return false;
}
