#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");

const tsxEntry = path.join(__dirname, "..", "node_modules", "tsx", "dist", "cli.mjs");
const child = spawn(
  process.execPath,
  [tsxEntry, path.join(__dirname, "cli.js"), ...process.argv.slice(2)],
  { stdio: "inherit" }
);
child.on("exit", (code) => process.exit(code ?? 1));
