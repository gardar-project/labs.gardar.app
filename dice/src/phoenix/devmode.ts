// @ts-nocheck // accessing internals for debugging purposes at no risk to end users
import { Angle } from "@babylonjs/core/Maths/math.path";
import { Phoenix } from "./phoenix";
import { Vector2, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { AxesViewer } from "@babylonjs/core/Debug/axesViewer";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

declare global {
    interface Window { 
        devmode: Devmode; 
        [ typeName : string ]: any;
    }
}

export class Devmode {
    /** These types get exported into global scope and can be used from console */
    static IMPORT_TYPES : {[ typeName : string ]: any} = { Angle, Vector2, Vector3 };
    public engine : Phoenix;
    public game : any;

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
        engine._system.loadStyle("src/phoenix/devmode.css");
        engine._renderer._scene.debugLayer.show({ embedMode: false });
        const wrapper = window.document.querySelector("#scene-explorer-host + div");
        Array.from(wrapper.children).forEach(e => window.document.body.appendChild(e));
        wrapper.remove();
    }
}
