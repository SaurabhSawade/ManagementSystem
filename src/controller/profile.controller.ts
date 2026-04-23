import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { asyncHandler } from "../utils/asyncHandler";
import { buildResponse } from "../utils/apiResponse";
import profileService from "../service/profile.service";

export const getMyProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = await profileService.getMyProfile(req.auth!.userId);

    res.status(HTTP_STATUS.OK).json(
      buildResponse({
        status: HTTP_STATUS.OK,
        success: true,
        message: MESSAGES.PROFILE_FETCHED,
        type: "SUCCESS",
        data: profile,
      }),
    );
  },
);
