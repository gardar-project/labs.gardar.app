import { type WebAppManifest } from "web-app-manifest";

export interface Config {
  deploymentRoot : string;
  version: string;
  appId: string; // after normalisation must match entry point file and export name
  devmode: boolean;
  installed: boolean;
  manifest: WebAppManifest;
}
