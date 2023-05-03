import { Camera } from "./camera";
import { Light } from "./data/light";
import { Material } from "./material";
import { Vector3 } from "./vector3";
import { WorldObject } from "./world-object";

export interface Renderer {
    get camera() : Camera;
    createBox(data? : { 
        insideOut? : boolean, 
        material?: Material,
        position?: Vector3,
        rotation?: Vector3
    }) : WorldObject;
    createLight(data : Partial<Light>) : WorldObject;
}
