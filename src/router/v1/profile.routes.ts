import { Router } from "express";
import { getMyProfileController } from "../../controller/profile.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const profileRouter = Router();

profileRouter.get("/me", requireAuth, getMyProfileController);

export default profileRouter;
