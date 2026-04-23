import { Router } from "express";
import profileController from "../../controller/profile.controller";
import authMiddleware from "../../middleware/auth.middleware";

const profileRouter = Router();

profileRouter.get("/me", authMiddleware.requireAuth, profileController.getMyProfile);

export default profileRouter;
