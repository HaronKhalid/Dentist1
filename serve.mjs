// Tiny static server with clean URLs (/about -> about.html). Usage: node serve.mjs [port]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.argv[2]) || 3000;
const base = (process.argv[3] || "").replace(/\/$/, ""); // optional sub-path, e.g. /Dentist1 (mimics GitHub Pages)
const types = {
  ".html": "text/html; charset=utf-8", ".mjs": "text/javascript", ".js": "text/javascript",
  ".json": "application/json", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif",
  ".woff2": "font/woff2", ".woff": "font/woff", ".mp4": "video/mp4", ".ico": "image/x-icon",
};
const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (base) { if (p === base) p = base + "/"; if (!p.startsWith(base + "/")) { res.writeHead(404); return res.end(); } p = p.slice(base.length) || "/"; }
  if (p.length > 1 && p.endsWith("/")) { res.writeHead(301, { Location: base + p.slice(0, -1) }); return res.end(); }
  const rel = p === "/" ? "/index.html" : p;
  const candidates = [rel, rel + ".html"].map((c) => path.join(root, c));
  const file = candidates.find((c) => c.startsWith(root) && isFile(c));
  if (!file) {
    res.writeHead(404, { "Content-Type": types[".html"] });
    return res.end(fs.readFileSync(path.join(root, "404.html")));
  }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`http://localhost:${port}`));
