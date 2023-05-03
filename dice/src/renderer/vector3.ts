export class Vector3 {
    public static ZERO : Vector3 = new Vector3(0,0,0);

    x: number;
    y: number;
    z: number;

    constructor(
            x: number,
            y: number,
            z: number
    ) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
