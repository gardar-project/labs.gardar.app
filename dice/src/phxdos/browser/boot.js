/**
 * @typedef {import("../../config").Config} Config
 * @typedef {import("web-app-manifest").WebAppManifest} WebAppManifest
 */

async function main() {
    const config = await loadConfig();
    const bundlePath = `./.build/${config.packageName.replaceAll('-', '/')}.js`;
    const simpleNameLower = config.packageName.replace(new RegExp(".*-"), "").toLowerCase();
    const script = window.document.createElement("script");
    // @ts-ignore
    window.phxdos = { config };
    script.type = "module";
    script.innerHTML = `
        const mainModule = await import("${bundlePath}");
        for (let moduleExport in mainModule) {
            if (moduleExport.toLowerCase() == "${simpleNameLower}") {
                await mainModule[moduleExport].main(window.phxdos.config);
            }
        }
    `;
    document.head.appendChild(script);
}

/**
 * Collects configuration data from: package.json, local storage, url args.
 * @returns {Promise<Config>}
 */
async function loadConfig() {
    const packageConfig = JSON.parse(await (await globalThis.fetch("package.json")).text());
    const config = /**@type {Config}*/(packageConfig["phoenix"]);
    config.deploymentRoot = window.location.origin + window.location.pathname;
    config.version = packageConfig.version;
    config.packageName = packageConfig.name;
    config.manifest = JSON.parse(await (await globalThis.fetch("config/manifest.json")).text());
    Object.assign(config, JSON.parse(window.localStorage.getItem("config.json") ?? "{}"));
    for (const argsString of [ globalThis.location.search, globalThis.location.hash ]) {
        for (let [key, value] of new URLSearchParams(argsString.substring(1))) {
            let parsed = "";
            try { parsed = JSON.parse(value != "" ? value : "true"); } catch { }
            // @ts-ignore
            config[key] = (value == "" || value === (parsed + "")) ? parsed : value;
        }
    }
    return config;
}

main();
