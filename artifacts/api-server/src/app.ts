import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

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

export default app;
