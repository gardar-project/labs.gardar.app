import { type WebAppManifest } from "web-app-manifest";
import { Color3 } from "./renderer/color3";
import PackageConfig from "../package.json";
import { Vector3 } from "./renderer/vector3";
import { Vector2 } from "./renderer/vector2";

type ConfigBase = typeof PackageConfig.phoenix;

export interface Config extends ConfigBase {
  deploymentRoot : string;
  packageRepository : string;
  packageConfig: typeof PackageConfig;
  devmode: boolean;
  installed: boolean;
  manifest: WebAppManifest;
  renderer: {
    resolution: Vector2,
    minPixelRatio: number,
    antialias: boolean,
    transparent: boolean,
    ambientColor: Color3,
    cameraHolder: {
      position: Vector3,
      scalingDeterminant: number
    },
    scene: {
      fogDensity: number,
      fogEnd: number,
      fogStart: number
    },
    pipeline: {
      sharpenEnabled: boolean,
      sharpen: {
        edgeAmount: number
      },
      fxaaEnabled: boolean,
      bloomScale: number,
      depthOfFieldEnabled: boolean,
      depthOfFieldBlurLevel: number,
      glowLayerEnabled: boolean,
      chromaticAberrationEnabled: boolean,
      grainEnabled: boolean,
      grain: {
        intensity: number
      }
    }
  }
}
