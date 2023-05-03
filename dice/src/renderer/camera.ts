import { WorldObject } from "./world-object";

export interface Camera extends WorldObject {
    fov: number;
    set controlsEnabled(value : boolean);
}
