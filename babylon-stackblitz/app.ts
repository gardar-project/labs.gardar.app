import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

import SceneHelper from './core/SceneHelper';

export default class App {
  /**
   * The main entry point for the 3D app.
   * @param engine - an instance of the 3D engine.
   */
  public createScene(engine: BABYLON.Engine): BABYLON.Scene {
    const scene = new BABYLON.Scene(engine);
    //scene.createDefaultEnvironment({});

    const arcRotate: boolean = false;
    SceneHelper.setupCamera(scene, arcRotate);
    SceneHelper.setupLight(scene);

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

    return scene;
  }
}
