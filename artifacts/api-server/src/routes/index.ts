import { Router, type IRouter } from "express";
import healthRouter from "./health";
import consultationRouter from "./consultation";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(consultationRouter);
router.use(chatRouter);

export default router;
