import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Serializer } from "./serializer";

export class Phxdos {
    private _config : Config;

    public static async load(config : Config) : Promise<Phxdos> {
		Serializer.inflate(config);
        var system = new Phxdos(config);
        system.loadStyle("src/phxdos/phxdos.css");
        console.log("phxdos loaded");
        return system;
    }

	public addMeta(name : string, data : any = {}) {
		const meta = document.createElement(name);
		for(let key of Object.getOwnPropertyNames(data)) {
			meta.setAttribute(key, data[key]);
		}
		document.head.appendChild(meta);
		return meta;
	}

	public loadStyle(url : string) {
		const alreadyLoaded = window.document.querySelector(`link[href="${url}"]`);
		if (alreadyLoaded) {
			return;
		}
		this.addMeta("link", { rel: "stylesheet", href: url });
	}

    private constructor(config : Config) {
        this._config = config;
    }
}
