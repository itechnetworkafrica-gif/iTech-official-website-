import { Router, type IRouter } from "express";
import healthRouter from "./health";
import consultationRouter from "./consultation";

const router: IRouter = Router();

router.use(healthRouter);
router.use(consultationRouter);

export default router;
