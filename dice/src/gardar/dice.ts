import { Config } from "../config";
import { Phoenix } from "../phoenix/phoenix";
import { Color3 } from "../renderer/color3";
import { Color4 } from "../renderer/color4";
import { Light } from "../renderer/data/light";
import { Engine } from "../renderer/engine";
import { LightType } from "../renderer/light-type";
import { Material } from "../renderer/material";
import { Vector3 } from "../renderer/vector3";
import { WorldObject } from "../renderer/world-object";
import { Math as PhoenixMath } from "../phoenix/math";

export class Dice {
    private _config : Config;
    private _engine : Engine;
    private _cage : WorldObject;
    private _dice : WorldObject;
    private _light : WorldObject;

    public static async main(config: Config) {
        const dice = await Dice.load(config);
    }

    public static async load(config : Config) : Promise<Dice> {
        const engine = await Phoenix.load(config);
        const cage = engine.renderer.createBox({ insideOut: true });
        const dice = engine.renderer.createBox({ 
            material: new Material(null, new Color4(1, 1, 0)),
            position: new Vector3(0, 1, 0)
        });
        const light = engine.renderer.createLight({
            color: new Color4(1, 1, 1, 0.75), 
            type: LightType.directional,
            rotation: new Vector3(0, PhoenixMath.degToRad(90), 0)
        });
        const game = new Dice(config, engine, cage, dice, light);
        game._updateCageSize(cage);
        window.addEventListener("resize", () => game._updateCageSize(cage));
        if(config.devmode) {
            window.devmode.game = game;
        }
        return game;
    }

    private constructor(
            config : Config, 
            engine : Engine, 
            cage : WorldObject,
            dice : WorldObject,
            light: WorldObject
    ) {
        this._config = config;
        this._engine = engine;
        this._cage = cage;
        this._dice = dice;
        this._light = light;
    }

    private _updateCageSize(cage : WorldObject) {
        const camera = this._engine.renderer.camera;
        // that one time in life when trygonometry is useful
        const boardWidth = 2 * Math.sin(camera.fov/2) * (camera.position.y / Math.cos(camera.fov/2));
        const aspectRatio = document.documentElement.clientWidth / document.documentElement.clientHeight;
        const boardLength = boardWidth * aspectRatio;
        cage.position = new Vector3(0, (camera.position.y-1) / 2, 0);
        cage.scale = new Vector3(boardLength+1, camera.position.y-1, boardWidth+1);
    }
}

