import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Camera as PhoenixCamera } from "../renderer/camera";
import { BabylonWorldObject } from "./babylon-world-object";
import { Camera as BabylonCameraComponent } from "@babylonjs/core/Cameras/camera";

export class BabylonCamera extends BabylonWorldObject implements PhoenixCamera {
    private _camera : BabylonCameraComponent;

    public constructor(camera : BabylonCameraComponent) {
        if (! (camera.parent instanceof TransformNode)) { 
            throw new Error("! camera.parent instanceof TransformNode");
        }
        super(camera.parent);
        this._camera = camera;
    }

    public get fov() : number { return this._camera.fov; }
    public set fov(value : number) { this._camera.fov = value; }

    public set controlsEnabled(value : boolean) {
        if (value) {
            this._camera.attachControl(this._camera.getEngine().currentViewport, true);
        } else {
            this._camera.detachControl();
        }
    }
}
