import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import consultationRouter from "./consultation.js";
import chatRouter from "./chat.js";
import authRouter from "./auth.js";
import portalRouter from "./portalRoutes.js";
import adminRouter from "./adminRoutes.js";
import syncRouter from "./syncRoutes.js";
import liveChatRouter from "./liveChat.js";
import partnershipsRouter from "./partnerships.js";
import billingRouter from "./billing.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(consultationRouter);
router.use(chatRouter);
router.use(authRouter);
router.use(portalRouter);
router.use(adminRouter);
router.use(syncRouter);
router.use(liveChatRouter);
router.use(partnershipsRouter);
router.use(billingRouter);

export default router;
