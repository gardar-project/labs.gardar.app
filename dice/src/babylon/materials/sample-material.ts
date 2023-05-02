import { Scene } from "@babylonjs/core/scene"
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial"

export class SampleMaterial extends ShaderMaterial {

    constructor(name: string, scene: Scene) {
        super(name, scene, { vertex: "sample", fragment: "sample" }, {
            uniforms: [
                "worldViewProjection",
                "time"
            ],
            attributes: [
                "position",
                "normal",
                "uv"
            ],
        })

        const startTime = Date.now()

        scene.registerBeforeRender(() => {
            const currentTime = Date.now()
            const time = currentTime - startTime

            this.time = time / 1000
        })
    }

    set time(value: number) {
        this.setFloat("time", value)
    }
}
