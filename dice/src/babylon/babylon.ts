import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera"
import { Engine } from "@babylonjs/core/Engines/engine"
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight"
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"
import { SampleMaterial } from "./materials/sample-material"
import { Effect } from "@babylonjs/core/Materials/effect"
import { Camera } from  "@babylonjs/core/Cameras/camera"
import { Config } from "../config"
import { DeviceOrientationCamera } from "@babylonjs/core/Cameras/deviceOrientationCamera"
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial"
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color"
import { Mesh } from "@babylonjs/core/Meshes/mesh"
import { Tools } from "@babylonjs/core/Misc/tools"
import { SerializationHelper } from "@babylonjs/core/Misc/decorators"
import { ArcFollowCamera } from "@babylonjs/core/Cameras/followCamera"
import { TransformNode } from "@babylonjs/core/Meshes/transformNode"

export class Babylon {
    private _config: Config;
    private _viewport: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _cameraHolder: TransformNode;

    constructor(config:Config, viewport:HTMLCanvasElement, engine:Engine, scene:Scene, cameraHolder: TransformNode) {
        this._config = config;
        this._viewport = viewport;
        this._engine = engine;
        this._scene = scene;
        this._cameraHolder = cameraHolder;
    }

    public static async load(config : Config, viewport : HTMLCanvasElement) : Promise<Babylon> {
        Effect.ShadersRepository = "src/babylon/shaders/";
        const engine = new Engine(viewport, false, {
            alpha: true,
            antialias: false
        });
        const scene = new Scene(engine);
        scene.activeCamera = new ArcRotateCamera("camera", 0, 0, 0, Vector3.Zero(), scene);
        const cameraHolder = MeshBuilder.CreateSphere("cameraHolder", { diameter: 1 }, scene);
        cameraHolder.isVisible = false;
        scene.activeCamera.parent = cameraHolder;
        const renderer = new Babylon(config, viewport, engine, scene, cameraHolder);
        await renderer._loadShader("src/babylon/shaders/sample.vertex.glsl");
        await renderer._loadShader("src/babylon/shaders/sample.fragment.glsl");
        engine.runRenderLoop(() => { scene.render() });
        return renderer;
    }

    private async _loadShader(path: string) {
        const name = path.replace(new RegExp(".*/"), "").replace(new RegExp("\..glsl$"), "");
        Effect.ShadersStore[name] = await (await globalThis.fetch(path)).text();
    }

    public enableCameraControls() {
        this._camera.attachControl(this._viewport, true);
    }

    public disableCameraControls() {
        this._camera.detachControl();
    }

    private get _camera() : Camera {
        if (this._scene.activeCamera == null) {
            throw new Error("activeCamera == null");
        }
        return this._scene.activeCamera;
    }

    public async setupDemo() {
        // this._camera.noRotationConstraint=true;
        // this._camera.upVector = new Vector3(1, 0.2, -1);
    
        // this._scene.activeCamera = new ArcFollowCamera("camera", Tools.ToRadians(-90), 0, 10, null, this._scene);
        // const camera = new ArcRotateCamera("camera", 0, 0, 0, Vector3.Zero(), this._scene);

        // this._scene.activeCamera = new FreeCamera()

        // this._scene.activeCamera = new DeviceOrientationCamera("main", new Vector3(0, 0, 0), this._scene);
        // for (let inputName in this._scene.activeCamera.inputs.attached) {
        //     if (inputName != "deviceOrientation") {
        //         this._scene.activeCamera.inputs.attached[inputName].detachControl();
        //     }
        // }
        // this.enableCameraControls();
        // this._scene.activeCamera.setTarget(new Vector3(0, 0, 0));

        // this._camera.position = new Vector3(0, 10, 0);
        // this._camera.upVector = new Vector3(0, 0, 1);
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this._scene);

        var alphaMaterial = new StandardMaterial("alpha", this._scene);
        alphaMaterial.alpha = 0.5;//TODO
        alphaMaterial.diffuseColor = new Color3(1, 0, 0);

        const mesh = MeshBuilder.CreatePlane("board", { size: 1 }, this._scene);
        mesh.position = new Vector3(0, 0, 0);
        mesh.rotation = new Vector3(1.57, 0, 0);
        mesh.material = alphaMaterial;



        var redMat = new StandardMaterial("red", this._scene);
        redMat.diffuseColor = new Color3(1, 0, 0);
        redMat.emissiveColor = new Color3(1, 0, 0);
        redMat.specularColor = new Color3(1, 0, 0);

        var plane1 = Mesh.CreatePlane("plane1", 3, this._scene, true, Mesh.DOUBLESIDE);
        plane1.position.x = -3;
        plane1.position.z = 0;
        plane1.material = redMat;

        // var ground = Mesh.CreateGround("ground1", 10, 10, 2, this._scene);
        // ground.material = alphaMaterial;
        // ground.position.y = -2;
        globalThis.demo = { camera: this._scene.activeCamera, light, mesh, plane1, renderer: this }
    }
}
