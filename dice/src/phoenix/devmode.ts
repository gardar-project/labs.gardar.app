import { Angle } from "@babylonjs/core/Maths/math.path";
import { Phoenix } from "./phoenix";
import { Vector2, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { AxesViewer } from "@babylonjs/core/Debug/axesViewer";

declare global {
    interface Window { 
        devmode: Devmode; 
        [ typeName : string ]: any;
    }
}

export class Devmode {
    static IMPORT_TYPES : {[ typeName : string ]: any} = { Angle, Vector2, Vector3 };
    public engine : Phoenix;

    private constructor(engine : Phoenix) {
        this.engine = engine;
    }

    public static async setup(engine : Phoenix) : Promise<void> {
        const devmode = new Devmode(engine);
        window.devmode = devmode;
        for (let typeName in Devmode.IMPORT_TYPES) {
            window[typeName] = Devmode.IMPORT_TYPES[typeName];
        }
        new AxesViewer(engine._renderer._scene, 1);
    }
}
