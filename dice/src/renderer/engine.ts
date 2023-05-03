import { Renderer } from "./renderer";

export interface Engine {
    get renderer() : Renderer;
}
