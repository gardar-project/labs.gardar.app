import { Color4 } from "./color4";

export class Material {
    texturePath : string|null;
    color: Color4;

    constructor(
            texturePath : string|null,
            color: Color4
    ) {
        this.texturePath = texturePath;
        this.color = color;
    }
}
