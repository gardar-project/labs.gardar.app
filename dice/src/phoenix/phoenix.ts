import { Babylon } from "../babylon/babylon";
import { Phxdos } from "../phxdos/phxdos";
import { Serializer } from "../phxdos/serializer";
import { Engine } from "../renderer/engine";
import { Renderer } from "../renderer/renderer";
import { Devmode } from "./devmode";

export class Phoenix implements Engine {
    private _config : Config;
    private _system : Phxdos;
    private _viewport : HTMLCanvasElement;
    private _renderer : Babylon;

    public static async load(config : Config) : Promise<Engine> {
        const system = await Phxdos.load(config);
        const viewport = Phoenix._createViewport();
        const renderer = await Babylon.load(config, viewport);
        const engine = new Phoenix(config, system, viewport, renderer);
        Serializer.applyOverrides(config, engine);
        if (config.devmode) {
            await Devmode.setup(engine);
        }
        return engine;
    }

    public get renderer() : Renderer {
        return this._renderer;
    }

    private static _createViewport() {
        const viewport = window.document.createElement("canvas");
        viewport.className = "viewport";
        window.document.body.appendChild(viewport);
        return viewport;
    }

    private constructor(
        config : Config, 
        system : Phxdos,
        viewport : HTMLCanvasElement,
        renderer : Babylon) {
        this._config = config;
        this._system = system;
        this._viewport = viewport;
        this._renderer = renderer;
    }
}
