const { pathToFileURL } = require("url");

const { SourceMapConsumer } = require("@pmmmwh/react-refresh-webpack-plugin/node_modules/source-map");

const wasmPath = require.resolve("@pmmmwh/react-refresh-webpack-plugin/node_modules/source-map/lib/mappings.wasm");
SourceMapConsumer.initialize({
  "lib/mappings.wasm": pathToFileURL(wasmPath).href,
});

process.env.GENERATE_SOURCEMAP = "false";
process.env.NODE_OPTIONS = "--openssl-legacy-provider";

require("react-scripts/scripts/build");