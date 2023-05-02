import { type WebAppManifest } from "web-app-manifest";

export interface Config {
  deploymentRoot : string;
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
}
