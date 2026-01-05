import * as userRepo from "../repositories/user.repo.mjs";

// --------------------------------------------------
export const createOrGetUser = async (data) => {
  if (!data || !data.email) {
    throw new CustomError("Invalid user data: email missing", 400);
  }

  const existingUser = await userRepo.getUserByEmailRepo(data.email);

  if (existingUser) {
    return {
      exists: true,
      user: existingUser,
    };
  }

  const newUser = await userRepo.createUserRepo(data);

  return {
    created: true,
    user: newUser,
  };
};

// --------------------------------------------------
export const addDevice = async (id, device) => {
  return await userRepo.addDeviceRepo(id, device);
};

export const removeDevice = async (id, device) => {
  return await userRepo.removeDeviceRepo(id, device);
};

export const getAllUsers = async () => {
  return await userRepo.getAllUsersRepo();
};

export const getUserById = async (id) => {
  return await userRepo.getUserByIdRepo(id);
};
