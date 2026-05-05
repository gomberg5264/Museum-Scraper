import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import fs from "fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const publicDir = process.env["PUBLIC_DIR"];
if (publicDir && fs.existsSync(publicDir)) {
  const absolutePublicDir = path.resolve(publicDir);
  app.use(express.static(absolutePublicDir));
  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(absolutePublicDir, "index.html"));
  });
  logger.info({ publicDir: absolutePublicDir }, "Serving static frontend");
}

export default app;
