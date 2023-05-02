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
import { Angle } from "@babylonjs/core/Maths/math.path"

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
        await renderer._loadShader("sampleVertexShader", "src/babylon/shaders/sample.vertex.glsl");
        await renderer._loadShader("sampleFragmentShader", "src/babylon/shaders/sample.fragment.glsl");
        window.addEventListener("resize", () => engine.resize());
        engine.runRenderLoop(() => { scene.render() });
        engine.resize();
        return renderer;
    }

    private async _loadShader(name: string, path: string) {
        // const name = path.replace(new RegExp(".*/"), "").replace(new RegExp("\..glsl$"), "");
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
        this._cameraHolder.rotation = new Vector3(0, -Angle.FromDegrees(90).radians(), 0);
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this._scene);

        const alphaMaterial = new StandardMaterial("alpha", this._scene);
        alphaMaterial.alpha = 0.5;//TODO
        alphaMaterial.diffuseColor = new Color3(1, 0, 0);
        alphaMaterial.specularColor = new Color3(1, 0, 0);
        alphaMaterial.ambientColor = new Color3(1, 0, 0);
        alphaMaterial.emissiveColor = new Color3(1, 0, 0);

        const board = MeshBuilder.CreatePlane("board", { size: 1 }, this._scene);
        board.position = new Vector3(0, 0, 0);
        board.rotation = new Vector3(Angle.FromDegrees(90).radians(), 0, 0);
        board.material = alphaMaterial;

        this.updateBoardSize(board);
        window.addEventListener("resize", () => this.updateBoardSize(board));

        const dice = MeshBuilder.CreateBox("dice", { size: 1 }, this._scene);
        dice.position = new Vector3(0, 0, 0);
        dice.rotation = new Vector3(0, 0, 0);
        globalThis.demo = { camera: this._scene.activeCamera, light, board, renderer: this }
    }

    updateBoardSize(board : Mesh) {
        // that one time in life when trygonometry is useful
        const boardWidth = 2 * Math.sin(this._camera.fov/2) * (this._cameraHolder.position.y / Math.cos(this._camera.fov/2));
        const aspectRatio = document.documentElement.clientWidth / document.documentElement.clientHeight;
        const boardLength = boardWidth * aspectRatio;
        board.scaling = new Vector3(boardLength*1.1, boardWidth*1.1, 1);
    }
}
