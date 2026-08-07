import express, { type Express } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { buildOriginValidator } from "./middleware/validateOrigin.js";

const app: Express = express();

const configuredCorsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowAnyOrigin = configuredCorsOrigins.length === 0;
const allowCrossSiteCookies = process.env.COOKIE_CROSS_SITE === "true";

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

// Trust proxy for cookies in production
app.set("trust proxy", 1);

// CSRF defence: reject unsafe cross-origin requests whose Origin is not
// in the allowlist. Required when COOKIE_CROSS_SITE=true because
// SameSite=None cookies are sent on cross-origin form submissions that
// bypass preflight checks. Registered before CORS so blocked requests get
// a clean 403 instead of a CORS error.
if (!allowAnyOrigin || allowCrossSiteCookies) {
  app.use(buildOriginValidator(configuredCorsOrigins, allowCrossSiteCookies));
}

app.use(
  cors({
    origin: allowAnyOrigin
      ? true
      : (origin, callback) => {
          if (!origin || configuredCorsOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Origin is not allowed by CORS"));
          }
        },
    credentials: true,
  }),
);

app.use(cookieParser(process.env.SESSION_SECRET || "itech-portal-secret"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", router);

// In production, also serve the built frontend so a single process can host
// the whole app (website at "/", API under "/api"). In artifact-routed
// deployments the platform serves the static site itself and these routes are
// simply never hit; in single-process deployments they make the site work.
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(
  moduleDir,
  "../../itech-network-africa/dist/public",
);

if (process.env.NODE_ENV === "production" && fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  // SPA fallback for any non-API route
  app.get(/^\/(?!api(\/|$)).*/, (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
  logger.info({ frontendDist }, "Serving static frontend");
}

export default app;
