import { execSync } from "child_process";
import { existsSync } from "fs";

function run(cmd, label) {
  console.log(`\n> ${label ?? cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

const pnpm = "npx --yes pnpm@latest";

// Step 1: Install workspace dependencies (skipped if already done)
if (!existsSync("artifacts/api-server/node_modules")) {
  run(`${pnpm} install --no-frozen-lockfile`, "Installing dependencies...");
} else {
  console.log("\nDependencies already installed, skipping...");
}

// Step 2: Build API server
run(
  `${pnpm} --filter @workspace/api-server run build`,
  "Building API server..."
);

// Step 3: Build frontend
run(
  `${pnpm} --filter @workspace/nyc-museums run build`,
  "Building frontend..."
);

// Step 4: Start unified server
process.env.PORT ??= "3000";
process.env.PUBLIC_DIR = "artifacts/nyc-museums/dist/public";
process.env.NODE_ENV ??= "production";

console.log(
  `\nStarting server at http://localhost:${process.env.PORT} ...\n`
);

await import("./artifacts/api-server/dist/index.mjs");
