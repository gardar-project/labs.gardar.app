export class Color3 {
    public static WHITE : Color3 = new Color3(1,1,1);

    r: number;
    g: number;
    b: number;

    constructor(
            r: number,
            g: number,
            b: number
    ) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}
