import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const hashPassword = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, SALT_ROUNDS);
};

const comparePassword = async (
  plain: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};

const passwordUtils = {
  hashPassword,
  comparePassword,
};

export default passwordUtils;
