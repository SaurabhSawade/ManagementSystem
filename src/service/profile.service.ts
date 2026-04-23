import profileModel from "../model/profile.model";
import { AppError } from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";

export const getMyProfile = async (userId: string) => {
  const user = await profileModel.findProfileByUserId(userId);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found", "NOT_FOUND");
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    isBlocked: user.isBlocked,
    isActive: user.isActive,
    roles: user.roles.map((r) => r.role.code),
    studentProfile: user.studentProfile,
    teacherProfile: user.teacherProfile,
  };
};

const profileService = {
  getMyProfile,
};

export default profileService;
