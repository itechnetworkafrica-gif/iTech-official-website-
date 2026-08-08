import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import consultationRouter from "./consultation.js";
import chatRouter from "./chat.js";
import authRouter from "./auth.js";
import portalRouter from "./portalRoutes.js";
import adminRouter from "./adminRoutes.js";
import syncRouter from "./syncRoutes.js";
import liveChatRouter from "./liveChat.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(consultationRouter);
router.use(chatRouter);
router.use(authRouter);
router.use(portalRouter);
router.use(adminRouter);
router.use(syncRouter);
router.use(liveChatRouter);

export default router;
