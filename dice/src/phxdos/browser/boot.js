async function main() {
    const appId = globalThis.phxdos.app;
    const bundlePath = `.build/${appId}.js`;
    // TODO: detect if bundle is missing (hobbyist deployment?), then fall-back to dev mode
}

main();
