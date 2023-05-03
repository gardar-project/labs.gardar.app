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
import { Material } from "@babylonjs/core/Materials/material"
import { WorldObject } from "../renderer/world-object"
import { Renderer } from "../renderer/renderer"
import { BabylonWorldObject } from "./babylon-world-object"
import { BabylonCamera } from "./babylon-camera"
import { Camera as PhoenixCamera } from "../renderer/camera"
import { Light } from "../renderer/data/light"
import { LightType } from "../renderer/light-type"
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight"
import { Color3 as PhoenixColor3 } from "../renderer/color3"
import { Vector3 as PhoenixVector3 } from "../renderer/vector3"
import { PointLight } from "@babylonjs/core/Lights/pointLight"
import { SpotLight } from "@babylonjs/core/Lights/spotLight"
import { Material as PhoenixMaterial } from "../renderer/material"
// import HavokPhysics from "@babylonjs/havok"
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin"
import "@babylonjs/core/Physics/physicsEngineComponent"
import "@babylonjs/loaders/glTF"
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline"

export class Babylon implements Renderer {
    private _config: Config;
    private _viewport: HTMLCanvasElement;
    private _engine: Engine;
    private _pipeline: DefaultRenderingPipeline;
    private _scene: Scene;
    private _cameraHolder: TransformNode;
    private _alphaMaterial: Material;
    private _ambientColor: Color3;

    constructor(
            config:Config, 
            viewport:HTMLCanvasElement, 
            engine:Engine, 
            pipeline:DefaultRenderingPipeline,
            scene:Scene, 
            cameraHolder: TransformNode,
            alphaMaterial: Material,
            ambientColor: Color3) {
        this._config = config;
        this._viewport = viewport;
        this._engine = engine;
        this._pipeline = pipeline;
        this._scene = scene;
        this._cameraHolder = cameraHolder;
        this._alphaMaterial = alphaMaterial;
        this._ambientColor = ambientColor;
    }

    public static async load(config : Config, viewport : HTMLCanvasElement) : Promise<Babylon> {
        Effect.ShadersRepository = "src/babylon/shaders/";
        const engine = new Engine(viewport, config.renderer.antialias, {
            alpha: config.renderer.transparent,
            antialias: config.renderer.antialias
        });
        engine.enableOfflineSupport = false; // custom offline setup
        if (config.renderer.antialias) {
            viewport.style.imageRendering = "auto";
        } else {
            viewport.style.imageRendering = "pixelated";
        }
        window.document.documentElement.classList.add("babylon");
        const scene = new Scene(engine);
        const ambientColor = Babylon._color3(config.renderer.ambientColor);
        const clearAlpha = config.renderer.transparent ? 0 : 1;
        scene.clearColor = new Color4(ambientColor.r, ambientColor.g, ambientColor.b, clearAlpha);
        scene.fogColor = ambientColor;
        scene.activeCamera = new ArcRotateCamera("camera", 0, 0, 0, Vector3.Zero(), scene);
        const cameraHolder = MeshBuilder.CreateSphere("cameraHolder", { diameter: 1 }, scene);
        cameraHolder.isVisible = false;
        scene.activeCamera.parent = cameraHolder;
        const alphaMaterial = Object.assign(new StandardMaterial("alpha", scene), { alpha: 0 });
        await this._loadShader("sampleVertexShader", "src/babylon/shaders/sample.vertex.glsl");
        await this._loadShader("sampleFragmentShader", "src/babylon/shaders/sample.fragment.glsl");
        const pipeline = new DefaultRenderingPipeline("phoenix", false, scene);
        const renderer = new Babylon(config, viewport, engine, pipeline, scene, cameraHolder, alphaMaterial, ambientColor);
        window.addEventListener("resize", () => renderer._updateResolution());
        engine.runRenderLoop(() => {  scene.render(); });
        renderer._updateResolution();
        await renderer._setupPhysics();
        return renderer;
    }

    private _updateResolution() {
        let pixelRatio = this._viewport.clientHeight / this._config.renderer.resolution.y;
        pixelRatio = Math.max(pixelRatio, this._config.renderer.minPixelRatio);
        this._engine.setHardwareScalingLevel(pixelRatio);
        this._engine.resize();
    }

    private async _setupPhysics() {
        const packageName = "@babylonjs/havok";
        const packageVersion = this._config.packageConfig.dependencies[packageName];
        const filePath = `${packageName}@${packageVersion}/HavokPhysics_es.js`;
        const packagePath = `https://${this._config.packageRepository}/${filePath}`;
        const havok = await (await import(packagePath)).default();
        this._scene.enablePhysics(new Vector3(0, -9.81, 0), new HavokPlugin(true, havok));
    }

    private static _color3(color : PhoenixColor3) : Color3 {
        return new Color3(color.r, color.g, color.b).toLinearSpace();
    }

    private static _vector3(vector : PhoenixVector3) : Vector3 {
        return new Vector3(vector.x, vector.y, vector.z);
    }

    private static async _loadShader(name: string, path: string) {
        // const name = path.replace(new RegExp(".*/"), "").replace(new RegExp("\..glsl$"), "");
        Effect.ShadersStore[name] = await (await globalThis.fetch(path)).text();
    }

    public get camera() : PhoenixCamera {
        if (this._scene.activeCamera == null) {
            throw new Error("activeCamera == null");
        }
        return new BabylonCamera(this._scene.activeCamera);
    }

    public createBox(options? : { 
            insideOut? : boolean, 
            material? : PhoenixMaterial,
            position?: PhoenixVector3,
            rotation?: PhoenixVector3
    }) : WorldObject {
        const sideOrientation = options?.insideOut == true ? Mesh.BACKSIDE : Mesh.FRONTSIDE;
        const box = MeshBuilder.CreateBox("box", { size: 1, sideOrientation }, this._scene);
        box.material = this._alphaMaterial;
        const worldObject =  new BabylonWorldObject(box);
        if (options?.material != null) {
            worldObject.material = options?.material;
        }
        if (options?.position != null) {
            worldObject.position = options.position;
        }
        if (options?.rotation != null) {
            worldObject.rotation = options.rotation;
        }
        return worldObject;
    }

    public createLight(data : Partial<Light>) : WorldObject {
        const lightHolder = new TransformNode("lightHolder", this._scene);
        lightHolder.position = Babylon._vector3(data.position ?? PhoenixVector3.ZERO);
        lightHolder.rotation = Babylon._vector3(data.rotation ?? PhoenixVector3.ZERO);
        let light;
        switch(data.type) {
            case LightType.directional: {
                light = new HemisphericLight("light", Vector3.Zero(), this._scene);
                light.groundColor = this._ambientColor;
                break;
            } case LightType.point: {
                light = new PointLight("light", Vector3.Zero(), this._scene);
                break;
            } case LightType.spot: {
                light = new SpotLight("light", Vector3.Zero(), Vector3.Zero(), data.angle ?? 45, 1/(data.range ?? 1), this._scene);
                break
            } default: {
                throw new Error("invalid light type: " + data.type);
            }
        }
        light.parent = lightHolder;
        light.range = data.range ?? 1;
        light.radius = data.range ?? 1;
        light.shadowEnabled = true;
        light.diffuse = Babylon._color3(data.color ?? PhoenixColor3.WHITE);
        light.intensity = data?.color?.a ?? 1;
        light.specular = new Color3(
                light.diffuse.r*light.intensity,
                light.diffuse.g*light.intensity,
                light.diffuse.b*light.intensity);
        return new BabylonWorldObject(lightHolder);
    }
}
