import { type WebAppManifest } from "web-app-manifest";
import { Color3 } from "./renderer/color3";
import type PackageConfig from "../package.json";

export interface Config {
  deploymentRoot : string;
  packageRepository : string;
  packageConfig: typeof PackageConfig;
  version: string;
  /**
   * '-' characters are interpreted as namespace separators
   * after normalisation must match path of entry point file and export name
   * e.g. 'gardar-dice' matches 'gardar/dice.ts' and 'export class Dice'
   */
  packageName: string;
  devmode: boolean;
  installed: boolean;
  manifest: WebAppManifest;
  renderer: {
    antialias: boolean,
    transparent: boolean,
    ambientColor: Color3
  }
}
