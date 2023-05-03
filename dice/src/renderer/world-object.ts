import { Material } from "./material";
import { Vector3 } from "./vector3";

export interface WorldObject {
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
    set material(value : Material);
}
