import { Color4 } from "../color4";
import { LightType } from "../light-type";
import { Vector3 } from "../vector3";

export class Light {
    color: Color4;
    type: LightType;
    position: Vector3;
    rotation: Vector3;
    range: number;
    angle: number;

    constructor(
            color: Color4,
            type: LightType,
            position: Vector3,
            rotation: Vector3,
            range: number,
            angle: number
    ) {
        this.color = color;
        this.type = type;
        this.position = position;
        this.rotation = rotation;
        this.range = range;
        this.angle = angle;
    }
}
