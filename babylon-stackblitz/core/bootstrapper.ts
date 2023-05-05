import * as BABYLON from 'babylonjs';

import App from '../app';

export default class Bootstrapper {
  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;

  public start(root: HTMLElement, app: App) {
    const canvas = document.createElement('canvas');
    this._canvas = canvas;
    root.appendChild(canvas);

    const engine = new BABYLON.Engine(canvas);
    this._engine = engine;
    
    this._resize();
    const scene = app.createScene(engine);

    engine.runRenderLoop(() => {
      scene.render();
    });
    
    window.addEventListener('resize', () => this._resize());
  }

  private _resize(): void {
    this._canvas.style.width = window.innerWidth + 'px';
    this._canvas.style.height = window.innerHeight + 'px';
    this._engine.resize();
  }
}