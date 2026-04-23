import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import asyncUtils from "../utils/asyncHandler";
import apiResponse from "../utils/apiResponse";
import profileService from "../service/profile.service";

const profileController = {
  getMyProfile: asyncUtils.asyncHandler(async (req: Request, res: Response) => {
    const profile = await profileService.getMyProfile(req.auth!.userId);

    res.status(HTTP_STATUS.OK).json(
      apiResponse.buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: MESSAGES.PROFILE_FETCHED,
        type: "SUCCESS",
        data: profile,
      }),
    );
  }),
};

export default profileController;
