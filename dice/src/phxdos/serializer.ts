import { Vector2, Vector3 } from "@babylonjs/core/Maths/math.vector";

class _Serializer {
    static TYPE_DESCRIMINATOR_KEY = "$type";
    static IMMUTABLE_VALUE_TYPES = new Set([Vector2, Vector3]);
    static SUPPORTED_CLASSES : { [name: string] : () => any} = {
        Vector2: () => new Vector2(0,0),
        Vector3: () => new Vector3(0,0,0)
    }

    /**
     * Recursively transforms plain old objects into class instances, where $type is declared
     * Only types listed in _Serializer._supportedClasses are processed.
     */
    public inflate(object : any) {
        for (let key in object) {
            if (object[key] == null || typeof object[key] != "object") {
                continue;
            }
            this.inflate(object[key]);
            const type = object[key][_Serializer.TYPE_DESCRIMINATOR_KEY];
            if (type != null && _Serializer.SUPPORTED_CLASSES[type] != null) {
                const inflated = _Serializer.SUPPORTED_CLASSES[type]();
                delete object[key][_Serializer.TYPE_DESCRIMINATOR_KEY];
                Object.assign(inflated, object[key]);
                object[key] = inflated;
            }
        }
    }

    /**
     * Recursively merges object into another.
     * @param source 
     * @param target 
     */
    public applyOverrides(source:any, target:any) {
        for (let key in source) {
            let targetKey = key;
            if (target[key] === undefined) {
                if(target["_" + key] !== undefined) {
                    targetKey = "_" + key;
                } else {
                    continue;
                }
            }
            if (typeof source[key] != "object") {
                if (target == this) {
                    continue;
                }
                target[targetKey] = source[key];
                continue;
            }
            if (target[targetKey] == null) {
                target[targetKey] = source[key];
                continue;
            }
            if (_Serializer.IMMUTABLE_VALUE_TYPES.has(target[targetKey].constructor)) {
                target[targetKey] = source[key];
                continue;
            }
            this.applyOverrides(source[key], target[targetKey]);
        }
    }
}

export const Serializer = new _Serializer();
