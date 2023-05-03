class _Math {
    degToRad(degrees : number) {
        return degrees * globalThis.Math.PI / 180;
    }
}

export const Math = new _Math();
