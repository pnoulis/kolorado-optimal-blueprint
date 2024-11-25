import * as esbuild from "esbuild";
import { join } from "node:path";

const transformAbsoluteModuleImports = {
  name: "transformAbsoluteModuleImports",
  setup(build) {
    build.onResolve({ filter: /^\// }, (args) => ({
      path: join(import.meta.dirname, args.path),
    }));
  },
};

if (process.env.NODE_ENV === "production") {
  esbuild.build({
    bundle: true,
    entryPoints: ["src/server/index.js"],
    outfile: "dist/out.js",
    plugins: [transformAbsoluteModuleImports],
    minify: true,
    treeShaking: true,
    format: "esm",
    platform: "node",
    target: "es2022",
    packages: "external",
  });
} else {
  esbuild.build({
    bundle: true,
    entryPoints: ["src/server/index.js"],
    outfile: "dist/out-dev.js",
    plugins: [transformAbsoluteModuleImports],
    minify: false,
    treeShaking: false,
    format: "esm",
    platform: "node",
    target: "es2022",
    packages: "external",
  });
}
