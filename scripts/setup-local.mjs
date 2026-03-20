#!/usr/bin/env node
/**
 * SignForge Local Setup Script
 * Initializes the project for first-time local development.
 *
 * Usage: pnpm setup   (or: node scripts/setup-local.mjs)
 */
import { execSync } from "child_process";
import { existsSync, copyFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const API_DIR = resolve(ROOT, "apps/api");

function run(cmd, opts = {}) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: ROOT, ...opts });
}

function step(msg) {
  console.log(`\n${"=".repeat(50)}\n  ${msg}\n${"=".repeat(50)}`);
}

// ── 1. Environment file ──
step("1/5  Environment variables");
if (!existsSync(resolve(ROOT, ".env"))) {
  copyFileSync(resolve(ROOT, ".env.example"), resolve(ROOT, ".env"));
  console.log("Created .env from .env.example");
  console.log(">>> IMPORTANT: edit .env and set your own SECRET_KEY & JWT_SECRET_KEY");
} else {
  console.log(".env already exists — skipping");
}

// ── 2. Frontend dependencies ──
step("2/5  Frontend dependencies (pnpm install)");
run("pnpm install");

// ── 3. Backend dependencies ──
step("3/5  Backend dependencies (pip install)");
try {
  run("pip install -r requirements.txt", { cwd: API_DIR });
} catch {
  console.log("pip install failed — trying pip3...");
  try {
    run("pip3 install -r requirements.txt", { cwd: API_DIR });
  } catch {
    console.log("WARNING: Could not install Python dependencies. Install manually:");
    console.log("  cd apps/api && pip install -r requirements.txt");
  }
}

// ── 4. Database initialization & seeding ──
step("4/5  Database setup & seed data");
try {
  run("python -m app.seed", { cwd: API_DIR });
} catch {
  try {
    run("python3 -m app.seed", { cwd: API_DIR });
  } catch {
    console.log("WARNING: Could not seed database. Run manually:");
    console.log("  cd apps/api && python -m app.seed");
  }
}

// ── 5. Verify ──
step("5/5  Setup complete!");
console.log(`
  To start the application:

    pnpm start

  Then open: http://localhost:3000

  Demo accounts:
    admin@signforge.dev   / admin123
    demo@signforge.dev    / demo1234
    teacher@signforge.dev / teach123
`);
