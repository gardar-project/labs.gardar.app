import { Config } from "../config";
import { Phoenix } from "../phoenix/phoenix";



export class Dice {
    private _config : Config;
    private _engine : Phoenix;

    public static async main(config: Config) {
        const dice = await Dice.load(config)
        await dice._engine._renderer.setupDemo();
    }

    public static async load(config : Config) : Promise<Dice> {
        const engine = await Phoenix.load(config);
        const dice = new Dice(config, engine);
        return dice;
    }

    private constructor(config : Config, engine : Phoenix) {
        this._config = config;
        this._engine = engine;
    }
}

