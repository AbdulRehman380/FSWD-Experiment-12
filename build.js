
const esbuild = require("esbuild");

esbuild.build({
    entryPoints: ["App.jsx"],
    bundle: true,
    outfile: "public/bundle.js",
    loader: { ".js": "jsx" }
}).then(() => console.log("Frontend built successfully"))
  .catch(() => process.exit(1));
