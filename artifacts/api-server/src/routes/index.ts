import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import museumsRouter from "./museums.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(museumsRouter);

export default router;
