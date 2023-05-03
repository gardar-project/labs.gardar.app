import { Vector3 as BabylonVector3 } from "@babylonjs/core/Maths/math.vector";
import { Vector3 as RendererVector3 } from "../renderer/vector3";
import { WorldObject } from "../renderer/world-object";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Material as PhoenixMaterial } from "../renderer/material";
import { Material as BabylonMaterial } from "@babylonjs/core/Materials/material";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color"
import { Texture } from "@babylonjs/core/Materials/Textures/texture";

export class BabylonWorldObject implements WorldObject {
    private _object: TransformNode;

    public constructor(object:TransformNode) {
        this._object = object;
    }

    public get position() : RendererVector3 { return this._object.position; }
    public get rotation() : RendererVector3 { return this._object.rotation; }
    public get scale() : RendererVector3 { return this._object.scaling; }

    public set position(value : RendererVector3) { this._object.position = new BabylonVector3(value.x, value.y, value.z); }
    public set rotation(value : RendererVector3) { this._object.rotation = new BabylonVector3(value.x, value.y, value.z); }
    public set scale(value : RendererVector3) { this._object.scaling = new BabylonVector3(value.x, value.y, value.z); }

    public set material(value : PhoenixMaterial) {
        if ((this._object as any)["material"] === undefined) {
            throw new Error("no material to set");
        }
        const scene = this._object.getScene();
        const babylonMaterial = new StandardMaterial("material", scene);
        babylonMaterial.diffuseColor = new Color3(value.color.r, value.color.g, value.color.b);
        // babylonMaterial.specularColor = babylonMaterial.diffuseColor;
        // babylonMaterial.ambientColor = babylonMaterial.diffuseColor;
        // babylonMaterial.emissiveColor = babylonMaterial.diffuseColor;
        babylonMaterial.alpha = value.color.a;
        if (value.texturePath != null) {
            babylonMaterial.diffuseTexture = new Texture(value.texturePath, scene);
        }
        (this._object as any)["material"] = babylonMaterial;
    }
}
