import { Color3 } from "./color3";

export class Color4 extends Color3 {
    a: number;

    constructor(
        r: number,
        g: number,
        b: number,
        a: number = 1
    ) {
        super(r,g,b);
        this.a = a;
    }
}
