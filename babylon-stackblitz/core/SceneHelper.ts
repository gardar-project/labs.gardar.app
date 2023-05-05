export default class SceneHelper {
  /**
   * Sets up the camera for scene.
   */
  public static setupCamera(scene: BABYLON.Scene, arcRotate: boolean): void {
    // Creates, angles, distances and targets the camera
  	var camera 
      = arcRotate? new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene): new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This positions the camera
    if (camera instanceof BABYLON.ArcRotateCamera) {
      camera.setPosition(new BABYLON.Vector3(0, 5, -2));
    } else {
      camera.setTarget(BABYLON.Vector3.Zero());
    }

    // This attaches the camera to the canvas
    camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
  }

  /**
   * Sets up lighting for scene.
   */
  public static setupLight(scene: BABYLON.Scene): void {
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light 
      = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
  }
}