const fs = require("node:fs");
const path = require("node:path");
const esbuild = require("esbuild");

const publicDir = path.join(__dirname, "public");

async function build() {
    fs.mkdirSync(publicDir, { recursive: true });

    await esbuild.build({
        entryPoints: [path.join(__dirname, "App.jsx")],
        bundle: true,
        outfile: path.join(publicDir, "bundle.js"),
        loader: { ".js": "jsx" }
    });

    for (const file of ["index.html", "style.css"]) {
        fs.copyFileSync(path.join(__dirname, file), path.join(publicDir, file));
    }

    console.log("Frontend built successfully in public/");
}

build().catch((err) => {
    console.error("Frontend build failed:", err);
    process.exitCode = 1;
});
